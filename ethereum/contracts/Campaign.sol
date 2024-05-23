// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    /**
     * @dev Creates a new campaign contract.
     * @param minimum The minimum contribution required to join the campaign.
     */
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    /**
     * @dev Returns the list of deployed campaign contracts.
     * @return An array of addresses representing the deployed campaign contracts.
     */
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint256 numRequests;
    Request[] public requests;

    /**
     * @dev Creates a new campaign.
     * @param minimum The minimum contribution required to join the campaign.
     * @param creator The address of the campaign creator.
     */
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager, "Is not a manager");
        _;
    }

    /**
     * @dev Allows a user to contribute to the campaign.
     */
    function contribute() public payable {
        require(
            msg.value >= minimumContribution,
            "Minimum contribution not met"
        );
        require(!approvers[msg.sender], "Is not an approver");

        approvers[msg.sender] = true;
        approversCount++;
    }

    /**
     * @dev Creates a new spending request.
     * @param description The description of the spending request.
     * @param value The amount of funds requested.
     * @param recipient The address of the recipient of the funds.
     */
    function createRequest(
        string memory description,
        uint value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    /**
     * @dev Allows an approver to approve a spending request.
     * @param index The index of the spending request to approve.
     */
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    /**
     * @dev Finalizes a spending request and transfers the funds to the recipient.
     * @param index The index of the spending request to finalize.
     */
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    /**
     * @dev Returns the summary of the campaign.
     * @return The campaign manager, minimum contribution, number of approvers, and number of spending requests.
     */
    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    /**
     * @dev Returns the number of requests created in the campaign.
     * @return The count of requests.
     */
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
