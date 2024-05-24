import React, { useState } from "react";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaing";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/router";
import Link from "next/link";

function RequestNew({ campaignAddress }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log();

    const campaign = Campaign(campaignAddress);

    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${campaignAddress}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Link href={`/campaigns/${campaignAddress}/requests`}>
        <a>Back</a>
      </Link>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <h3>Create a Request</h3>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </Form.Field>

        <Message error header="Your request was not created" content={errorMessage} />

        <Button type="submit" primary loading={loading}>
          Create!
        </Button>
      </Form>
    </>
  );
}

export async function getServerSideProps(context) {
  const { campaignAddress } = context.query;

  return { props: { campaignAddress } };
}

export default RequestNew;
