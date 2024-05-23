import React from "react";
import { useRouter } from "next/router";

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

  // Perform API call or database query to fetch campaign data
  //const campaignData = await fetchCampaignData(campaignAddress);

  // Pass the campaign data as props to the component
  return {
    props: {
      campaignAddress,
    },
  };
}

export default CampaignShow;
