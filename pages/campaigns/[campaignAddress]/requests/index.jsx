import React, { useState } from "react";
import { Button, TableRow, TableHeaderCell, TableHeader, TableBody, Table } from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaing";
import RequestRow from "../../../../components/RequestRow";
import Link from "next/link";

function RequestIndex(props) {
  const [errorMessage, setErrorMessage] = useState("");

  const { campaignAddress } = props;
  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${campaignAddress}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10}}>Add Requests</Button>
        </a>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Recipient</TableHeaderCell>
            <TableHeaderCell>Approval Count</TableHeaderCell>
            <TableHeaderCell>Approve</TableHeaderCell>
            <TableHeaderCell>Finalize</TableHeaderCell>
          </TableRow>
        </TableHeader>
      <TableBody>{renderRows(props)}</TableBody>
      </Table>
      <div>Found {props.requestCount} request(s).</div>
    </>
  );
}

function renderRows({requests, campaignAddress, approversCount}) {
  return requests.map((request, index) => {
    return <RequestRow key={index} id={index} request={request} address={campaignAddress} approversCount={approversCount} />;
  });
}

export async function getServerSideProps(context) {
  // Fetch data for the campaign using the campaignAddress from the query parameters
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);

  // Fetch the number of requests for the campaign
  let requestCount = await campaign.methods.getRequestsCount().call();
  requestCount = parseInt(requestCount);

  let approversCount = await campaign.methods.approversCount().call();  

  // Fetch the details of each request
  const requests = await Promise.all(
    Array(requestCount)
      .fill()
      .map(async (element, index) => {
        const request = await campaign.methods.requests(index).call();
        // Making a serializable object
        return {
          description: request.description,
          value: request.value,
          recipient: request.recipient,
          complete: request.complete,
          approvalCount: request.approvalCount,
        };
      })
  );

  // Return the data as props
  return {
    props: {
      campaignAddress,
      requests,
      requestCount,
      approversCount
    },
  };
}

export default RequestIndex;
