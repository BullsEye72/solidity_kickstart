import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Link from "next/link";

export default function Home({ campaigns }) {
  const items = campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <div>
      <h3>Open Campaigns</h3>

      <Link href="/campaigns/new">
        <a>
          <Button content="Create Campaign" icon="add circle" primary floated="right" />
        </a>
      </Link>

      <Card.Group items={items} />
    </div>
  );
}

export async function getServerSideProps() {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return { props: { campaigns } };
}
