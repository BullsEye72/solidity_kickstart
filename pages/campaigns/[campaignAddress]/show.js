import React from "react";
import Campaign from "../../../ethereum/campaing";

const CampaignShow = ({ campaignAddress }) => {
  return (
    <>
      <h3>Campaign {campaignAddress}</h3>
    </>
  );
};

export async function getServerSideProps(context) {
  // Fetch data for the campaign using the campaignAddress from the query parameters
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  console.log(summary);

  // Pass the campaign data as props to the component
  return {
    props: {
      campaignAddress,
    },
  };
}

export default CampaignShow;
