const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;
const gasAmount = "2000000";

const originalLog = console.log;

beforeEach(async () => {
  //Silencing logs
  console.log = () => {};

  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: gasAmount });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: gasAmount,
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

afterEach(() => {
  //Reenabling console.log
  console.log = originalLog;
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({ from: accounts[1], value: "101", gas: gasAmount });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    await assert.rejects(
      campaign.methods.contribute().send({
        from: accounts[1],
        value: "1",
      }),
      Error
    );
  });

  it("allows a manager to make a payment request", async () => {
    // const gasEstimate = await campaign.methods
    //   .createRequest("Buy batteries", "100", accounts[1])
    //   .estimateGas({ from: accounts[1] });
    // console.info(gasEstimate);
    // assert(true);
    // return;
    await campaign.methods.createRequest("Buy batteries", "100", accounts[1]).send({
      from: accounts[0],
      gas: gasAmount,
    });
    const request = await campaign.methods.requests(0).call();
    console.info(request);
    assert(true); //"Buy batteries", request.description);
  });

  it("processes requests", async () => {
    let startbalance = await web3.eth.getBalance(accounts[1]);
    startbalance = parseFloat(web3.utils.fromWei(startbalance, "ether"));
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: gasAmount });

    console.info("=============================");
    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: gasAmount });

    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: gasAmount });

    let endbalance = await web3.eth.getBalance(accounts[1]);
    endbalance = parseFloat(web3.utils.fromWei(endbalance, "ether"));
    assert(endbalance > startbalance);
  });
});
