import React, { useState } from "react";
import { Form, FormField, Input, Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaing";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = ({ address }) => {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    const campaign = Campaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });

      router.replace(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  const onAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit} error={!!errorMessage}>
      <FormField>
        <label>Amount to Contribute</label>
        <Input value={amount} label="ether" labelPosition="right" onChange={onAmountChange} />
      </FormField>
      <Message error header="There was some errors with your submission" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
