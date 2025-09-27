// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract WorkHistory {
    address public owner;
    address public fluenceBackendAddress = 0xDCeFdee35A355715924C100870a5689b06c2dd95;
    uint256 public constant VERIFICATION_THRESHOLD = 3; // Need 3 verifications to trust
    
    modifier onlyFluenceBackend() {
        require(msg.sender == fluenceBackendAddress, "Only Fluence Backend");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    struct VerificationStatus {
        mapping(address => bool) companyToValidOrNot;
        uint256 count; // Number of verifications received
    }

    struct Organization {
        string orgName;
        string orgWebsite;
        string physicalAddress; // Renamed for clarity
        address orgWalletAddress;
        bool isTrusted;
        bool isFromConstructor;
    }

    address[] public pendingOrgs;
    mapping(address => Organization) public organizations;
    mapping(address => VerificationStatus) public verificationStatuses;

    struct DocumentRecord {
        bytes32 documentHash; // Hash of the document (e.g., IPFS hash)
        address addedBy; // Address of the organization that added the document
        uint256 timestamp; // Timestamp when the document was added
    }

    // Store the documents added by orgs only
    mapping(address => DocumentRecord[]) private userDocuments;
    mapping(address => bool) public registeredEmployees;

    struct ConstructorArgumentsOrganizations {
        string orgName;
        string orgWebsite;
        string physicalAddress;
        address orgWalletAddress;
    }

    event OrganizationAdded(address indexed orgAddress, string orgName);
    event OrganizationVerified(address indexed orgAddress, address verifiedBy);
    event OrganizationTrusted(address indexed orgAddress);
    event DocumentAdded(address indexed user, address indexed addedBy, bytes32 documentHash);
    event EmployeeRegistered(address indexed employee);

    constructor(ConstructorArgumentsOrganizations[] memory _orgs, address _fluenceBackendAddress){
        
        fluenceBackendAddress = _fluenceBackendAddress;
        
        for (uint256 i = 0; i < _orgs.length; i++) {
            organizations[_orgs[i].orgWalletAddress] = Organization({
                orgName: _orgs[i].orgName,
                orgWebsite: _orgs[i].orgWebsite,
                physicalAddress: _orgs[i].physicalAddress,
                orgWalletAddress: _orgs[i].orgWalletAddress,
                isTrusted: true,
                isFromConstructor: true
            });
            
            emit OrganizationAdded(_orgs[i].orgWalletAddress, _orgs[i].orgName);
            emit OrganizationTrusted(_orgs[i].orgWalletAddress);
        }
        owner = msg.sender;
    }

    function addOrganization(ConstructorArgumentsOrganizations memory _org) public {
        require(
            msg.sender == owner || organizations[msg.sender].isTrusted, 
            "Not authorized"
        );
        require(
            organizations[_org.orgWalletAddress].orgWalletAddress == address(0), 
            "Organization already exists"
        );

        organizations[_org.orgWalletAddress] = Organization({
            orgName: _org.orgName,
            orgWebsite: _org.orgWebsite,
            physicalAddress: _org.physicalAddress,
            orgWalletAddress: _org.orgWalletAddress,
            isTrusted: false,
            isFromConstructor: false
        });

        pendingOrgs.push(_org.orgWalletAddress);
        emit OrganizationAdded(_org.orgWalletAddress, _org.orgName);
    }

    function verifyOrganization(address _orgAddress) public {
        require(organizations[msg.sender].isTrusted, "Only trusted organizations can verify");
        require(!organizations[_orgAddress].isTrusted, "Organization already trusted");
        require(organizations[_orgAddress].orgWalletAddress != address(0), "Organization does not exist");
        require(!verificationStatuses[_orgAddress].companyToValidOrNot[msg.sender], "Already verified by this organization");

        verificationStatuses[_orgAddress].companyToValidOrNot[msg.sender] = true;
        verificationStatuses[_orgAddress].count++;

        emit OrganizationVerified(_orgAddress, msg.sender);

        // Check if verification threshold is met
        if (verificationStatuses[_orgAddress].count >= VERIFICATION_THRESHOLD) {
            organizations[_orgAddress].isTrusted = true;
            emit OrganizationTrusted(_orgAddress);
            
            // Remove from pending
            _removePendingOrg(_orgAddress);
        }
    }

    function registerEmployee(address _employee) public onlyFluenceBackend{
        registeredEmployees[_employee] = true;
        emit EmployeeRegistered(_employee);
    }

    function getUserDocuments(address _user) public view returns (DocumentRecord[] memory) {
        return userDocuments[_user];
    }

    function addDocument(address _user, bytes32 _documentHash) public {
        require(organizations[msg.sender].isTrusted, "Only trusted organizations can add documents");
        require(registeredEmployees[_user], "Employee not registered");

        userDocuments[_user].push(DocumentRecord({
            documentHash: _documentHash,
            addedBy: msg.sender,
            timestamp: block.timestamp
        }));

        emit DocumentAdded(_user, msg.sender, _documentHash);
    }

    function getPendingOrganizations() public view returns (address[] memory) {
        return pendingOrgs;
    }

    function getVerificationCount(address _orgAddress) public view returns (uint256) {
        return verificationStatuses[_orgAddress].count;
    }

    function hasVerified(address _orgAddress, address _verifier) public view returns (bool) {
        return verificationStatuses[_orgAddress].companyToValidOrNot[_verifier];
    }

    function _removePendingOrg(address _orgAddress) private {
        for (uint256 i = 0; i < pendingOrgs.length; i++) {
            if (pendingOrgs[i] == _orgAddress) {
                pendingOrgs[i] = pendingOrgs[pendingOrgs.length - 1];
                pendingOrgs.pop();
                break;
            }
        }
    }

    function checkIfEmployeeExists(address _employee) public view returns (bool) {
        return registeredEmployees[_employee];
    }

    function checkIfOrgExists(address _orgAddress) public view returns (bool) {
        return organizations[_orgAddress].orgWalletAddress != address(0);
    }

    // Emergency functions for owner
    function removeOrganization(address _orgAddress) public onlyOwner {
        require(!organizations[_orgAddress].isFromConstructor, "Cannot remove constructor organizations");
        delete organizations[_orgAddress];
        _removePendingOrg(_orgAddress);
    }

    function setVerificationThreshold(uint256 _newThreshold) public onlyOwner {
        // Note: This would require updating the constant to a state variable
        // VERIFICATION_THRESHOLD = _newThreshold;
    }
}