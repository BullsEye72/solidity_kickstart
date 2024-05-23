import React from "react";
import { useRouter } from "next/router";

const Campaign = () => {
  const router = useRouter();
  const { campaignAddress } = router.query;

  return (
    <div>
      <h3>Campaign {campaignAddress}</h3>
    </div>
  );
};

export default Campaign;
