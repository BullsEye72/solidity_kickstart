import React, { useState } from "react";
import { FormField, Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const CampaignNew = (props) => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onMinimumContributionChange = (event) => {
    setMinimumContribution(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      router.push("/");
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Create a Campaign</h3>

      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <FormField>
          <label>Minimum Contribution</label>
          <Input label="Wei" labelPosition="right" value={minimumContribution} onChange={onMinimumContributionChange} />
        </FormField>

        <Message error header="There was some errors with your submission" content={errorMessage} />

        <Button type="submit" primary loading={loading}>
          Create!
        </Button>
      </Form>
    </div>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default CampaignNew;

/*
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
 
function CampaignNew(props) {
  const [minimumContribution, setMinimumContribution] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  const onSubmit = async (event) => {
    event.preventDefault();
 
    setLoading(true);
    setErrorMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
 
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
 
      router.push("/");
    } catch (err) {
      setErrorMessage(err.message);
    }
 
    setLoading(false);
  };
 
  return (
    <div>
      <h3>Create a Campaign</h3>
      <Form error={!!errorMessage} onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </div>
  );
}
 
export default CampaignNew;
*/
