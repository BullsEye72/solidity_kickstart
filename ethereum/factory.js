import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(CampaignFactory.abi, "0xEB516faBd5a87075e6AC3a2117D8C1951bC67E46");

export default instance;
