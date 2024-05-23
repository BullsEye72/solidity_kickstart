import React from "react";
import Campaign from "../../../ethereum/campaing";
import { CardGroup, Grid, GridColumn, GridRow, Button } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import ContributeForm from "../../../components/contributeForm";
import Link from "next/link";

const renderCards = ({ minimumContribution, balance, requestsCount, approversCount, manager }) => {
  // Check if all props exist and are in the expected format
  if (
    typeof minimumContribution !== "string" ||
    typeof balance !== "string" ||
    typeof requestsCount !== "string" ||
    typeof approversCount !== "string" ||
    typeof manager !== "string"
  ) {
    return <div>Error: Invalid props</div>;
  }

  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description: "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: minimumContribution,
      meta: "Minimum Contribution (wei)",
      description: "You must contribute at least this much wei to become an approver",
    },
    {
      header: requestsCount,
      meta: "Number of Requests",
      description: "A request tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Campaign Balance (ether)",
      description: "The balance is how much money this campaign has left to spend",
    },
  ];

  return <CardGroup items={items} />;
};

const CampaignShow = (props) => {
  // Check if props.summary exists and is an object
  if (!props.summary || typeof props.summary !== "object") {
    return <div>Error: Invalid summary prop</div>;
  }

  return (
    <>
      <h3>Campaign {props.campaignAddress}</h3>

      <Grid>
        <GridRow>
          <GridColumn width={10}>{renderCards(props.summary)}</GridColumn>
          <GridColumn width={6}>
            <ContributeForm address={props.campaignAddress} />
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn>
            <Link href={`/campaigns/${props.campaignAddress}/requests/`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>
    </>
  );
};

export async function getServerSideProps(context) {
  // Fetch data for the campaign using the campaignAddress from the query parameters
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);
  const summary = await campaign.methods.getSummary().call();

  // Pass the campaign data as props to the component
  return {
    props: {
      campaignAddress,
      summary: {
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
      },
    },
  };
}

export default CampaignShow;
