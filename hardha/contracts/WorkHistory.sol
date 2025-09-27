// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

/**
 * @title DocumentHashLedger
 * @notice A simplified contract to demonstrate the core principle of the research paper:
 * storing and verifying *only* the cryptographic hash values of documents 
 * and identification on an immutable ledger for CV verification.
 * This mimics the data model of the consortium blockchain proposed.
 * * NOTE: The paper's solution is a permissioned Hyperledger Fabric network;
 * Solidity/EVM inherently lacks the complex organization-based permissioning 
 * described (Admin, Peer, Orderer, Certification Authority) and is typically public.
 * This contract focuses on data privacy (only hashes) and verification logic.
 */
contract DocumentHashLedger {

    // The document hash is the 'key' (or content) of the document record.
    // The Identification hash links the document to a specific applicant.
    struct DocumentRecord {
        bytes32 idHash;      // Hash of the applicant's identification (e.g., SHA-256 of SSN + Last Name) [cite: 199, 222]
        bool isValid;        // TRUE by default; can be set to FALSE by an administrator for correction (as per Figure 4)[cite: 261, 262].
        string reason;       // Explanation if isValid is set to FALSE[cite: 264].
    }

    // Mapping to store the document hash to its record (Immutable Ledger).
    // The key is the document's SHA-256 hash (bytes32).
    mapping(bytes32 => DocumentRecord) public ledger;

    // A list of trusted Organization Addresses that can submit (Set) data.
    // In the paper, these are Universities, Companies, Police, etc. with 'Peer' and 'Admin' roles.
    mapping(address => bool) public isTrustedOrganization;

    address public owner;

    // Admin role to manage trusted organizations and invalidate incorrect entries.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action.");
        _;
    }

    // Only a trusted organization can submit or invalidate a document hash.
    modifier onlyTrustedOrganization() {
        require(isTrustedOrganization[msg.sender], "Only a trusted organization can submit documents.");
        _;
    }

    constructor(address[] memory _initialOrganizations) {
        owner = msg.sender;
        for (uint i = 0; i < _initialOrganizations.length; i++) {
            isTrustedOrganization[_initialOrganizations[i]] = true;
        }
    }

    /**
     * @notice Allows a trusted organization to submit a document's hash and the applicant's ID hash.
     * This corresponds to the Set() function in the paper's workflow (Figure 5)[cite: 289].
     * @param _idHash The SHA-256 hash of the applicant's identification[cite: 222].
     * @param _docHash The SHA-256 hash of the original, verified document[cite: 223].
     */
    function setDocumentHash(bytes32 _idHash, bytes32 _docHash) public onlyTrustedOrganization {
        // Only set if the hash does not already exist, reinforcing immutability[cite: 201].
        require(ledger[_docHash].idHash == bytes32(0), "Document hash already exists and is immutable.");

        ledger[_docHash] = DocumentRecord({
            idHash: _idHash,
            isValid: true,      // Set to TRUE by default (as per Figure 4) [cite: 261]
            reason: ""
        });
    }

    /**
     * @notice Allows an administrator to invalidate an incorrect entry.
     * The original hash cannot be deleted, only marked invalid (Figure 4)[cite: 261, 262].
     * @param _docHash The document hash to be invalidated.
     * @param _reason The reason for the invalidation[cite: 262].
     */
    function invalidateEntry(bytes32 _docHash, string memory _reason) public onlyTrustedOrganization {
        require(ledger[_docHash].idHash != bytes32(0), "Document hash not found.");
        require(ledger[_docHash].isValid == true, "Entry is already invalid.");

        ledger[_docHash].isValid = false;
        ledger[_docHash].reason = _reason;
    }

    /**
     * @notice Allows a verifier (recruiter) to check the authenticity of a document.
     * This corresponds to the Verify() function in the paper's workflow (Figure 5)[cite: 300, 306, 314].
     * @param _idHash The SHA-256 hash of the applicant's identification provided by the verifier.
     * @param _docHash The SHA-256 hash of the document provided by the verifier.
     * @return A boolean indicating if the document is authentic and a status string.
     */
    function verifyDocument(bytes32 _idHash, bytes32 _docHash) public view returns (bool, string memory) {
        DocumentRecord storage record = ledger[_docHash];

        if (record.idHash == bytes32(0)) {
            return (false, "Document hash not found on ledger (Document is fake or not recorded).");
        }

        if (!record.isValid) {
            return (false, string(abi.encodePacked("Document record was marked invalid. Reason: ", record.reason)));
        }
        
        // Final check: The stored ID hash must match the ID hash provided by the verifier.
        if (record.idHash != _idHash) {
             return (false, "Document is valid, but the provided identification hash does not match the record.");
        }

        // Both hashes match and the record is valid.
        return (true, "Document is Authentic.");
    }

    /**
     * @notice Owner function to add new trusted organizations (e.g., a new University or Company).
     */
    function addTrustedOrganization(address _orgAddress) public onlyOwner {
        isTrustedOrganization[_orgAddress] = true;
    }
}