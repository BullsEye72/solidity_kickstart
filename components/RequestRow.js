import React from "react";
import { TableRow, TableCell, Popup, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaing";

const onApproveHandler = async (props) => {
  const accounts = await web3.eth.getAccounts();

  const campaign = Campaign(props.address);
  await campaign.methods.approveRequest(props.id).send({ from: accounts[0] });
};

const onFinalizeHandler = async (props) => {
  const campaign = Campaign(props.address);
  const accounts = await web3.eth.getAccounts();

  try {
    await campaign.methods.finalizeRequest(props.id).send({ from: accounts[0] });
  } catch (error) {
    alert(error.message);
  }
};

function RequestRow(props) {
  const request = props.request;
  const readyToFinalize = request.approvalCount >= props.approversCount / 2;

  return (
    <TableRow disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <TableCell>{props.id}</TableCell>
      <TableCell>{request.description}</TableCell>
      <TableCell>{web3.utils.fromWei(request.value, "ether")}</TableCell>
      <TableCell>
        <Popup content={request.recipient} trigger={<span>{request.recipient.substring(0, 8) + "..."}</span>} />
      </TableCell>
      <TableCell>
        {request.approvalCount}/{props.approversCount}
      </TableCell>
      <TableCell>
        {request.complete ? null : (
          <Button color="green" basic onClick={() => onApproveHandler(props)}>
            Approve
          </Button>
        )}
      </TableCell>
      <TableCell>
        {request.complete ? (
          "Finalized"
        ) : readyToFinalize ? (
          <Button color="teal" basic onClick={() => onFinalizeHandler(props)}>
            Finalize
          </Button>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

export default RequestRow;
