import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";
import { keccak256, encodePacked } from "viem";

describe("WorkHistory Contract", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  
  // Test accounts
  let owner: any;
  let trustedOrg1: any;
  let trustedOrg2: any;
  let trustedOrg3: any;
  let newOrg: any;
  let employee: any;
  let fluenceBackend: any;
  let accounts: any[];

  // Contract instance
  let workHistory: any;
  
  // Sample organizations for constructor
  const constructorOrgs = [
    {
      orgName: "TechCorp Inc",
      orgWebsite: "https://techcorp.com",
      physicalAddress: "123 Tech Street, Silicon Valley, CA",
      orgWalletAddress: "0x0000000000000000000000000000000000000000" // Will be replaced with actual address
    },
    {
      orgName: "InnovateLabs",
      orgWebsite: "https://innovatelabs.io", 
      physicalAddress: "456 Innovation Blvd, Austin, TX",
      orgWalletAddress: "0x0000000000000000000000000000000000000000" // Will be replaced with actual address
    },
    {
      orgName: "VerifiedCorp",
      orgWebsite: "https://verifiedcorp.com", 
      physicalAddress: "789 Verified Way, Seattle, WA",
      orgWalletAddress: "0x0000000000000000000000000000000000000000" // Will be replaced with actual address
    }
  ];

  beforeEach(async function () {
    // Get test accounts
    accounts = await viem.getWalletClients();
    owner = accounts[0];
    trustedOrg1 = accounts[1];
    trustedOrg2 = accounts[2];
    trustedOrg3 = accounts[3];
    newOrg = accounts[4];
    employee = accounts[5];
    fluenceBackend = accounts[6];

    // Update constructor orgs with actual addresses
    constructorOrgs[0].orgWalletAddress = trustedOrg1.account.address;
    constructorOrgs[1].orgWalletAddress = trustedOrg2.account.address;
    constructorOrgs[2].orgWalletAddress = trustedOrg3.account.address;

    // Deploy contract
    workHistory = await viem.deployContract("WorkHistory", [constructorOrgs, fluenceBackend.account.address]);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const contractOwner = await workHistory.read.owner();
      assert.equal(contractOwner.toLowerCase(), owner.account.address.toLowerCase());
    });

    it("Should set the correct fluence backend address", async function () {
      const backendAddress = await workHistory.read.fluenceBackendAddress();
      assert.equal(backendAddress.toLowerCase(), fluenceBackend.account.address.toLowerCase());
    });

    it("Should initialize constructor organizations as trusted", async function () {
      const org1 = await workHistory.read.organizations([trustedOrg1.account.address]);
      const org2 = await workHistory.read.organizations([trustedOrg2.account.address]);
      const org3 = await workHistory.read.organizations([trustedOrg3.account.address]);
      
      assert.equal(org1[0], "TechCorp Inc"); // orgName
      assert.equal(org1[4], true); // isTrusted
      assert.equal(org1[5], true); // isFromConstructor
      
      assert.equal(org2[0], "InnovateLabs"); // orgName
      assert.equal(org2[4], true); // isTrusted
      assert.equal(org2[5], true); // isFromConstructor
      
      assert.equal(org3[0], "VerifiedCorp"); // orgName
      assert.equal(org3[4], true); // isTrusted
      assert.equal(org3[5], true); // isFromConstructor
    });

    it("Should emit OrganizationAdded and OrganizationTrusted events during deployment", async function () {
      const deploymentBlockNumber = await publicClient.getBlockNumber();
      
      const addedEvents = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "OrganizationAdded",
        fromBlock: deploymentBlockNumber,
        strict: true,
      });

      const trustedEvents = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "OrganizationTrusted",
        fromBlock: deploymentBlockNumber,
        strict: true,
      });

      assert.equal(addedEvents.length, 3);
      assert.equal(trustedEvents.length, 3);
    });
  });

  describe("Organization Management", function () {
    it("Should allow owner to add new organization", async function () {
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com",
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };

      const beforeBlockNumber = await publicClient.getBlockNumber();
      await workHistory.write.addOrganization([newOrgData]);
      
      const events = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "OrganizationAdded",
        fromBlock: beforeBlockNumber + 1n,
        strict: true,
      });
      
      assert.equal(events.length, 1);

      const org = await workHistory.read.organizations([newOrg.account.address]);
      assert.equal(org[0], "StartupXYZ");
      assert.equal(org[4], false); // not trusted yet
      assert.equal(org[5], false); // not from constructor
    });

    it("Should allow trusted organization to add new organization", async function () {
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com",
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };

      await workHistory.write.addOrganization([newOrgData], {
        account: trustedOrg1.account
      });

      const org = await workHistory.read.organizations([newOrg.account.address]);
      assert.equal(org[0], "StartupXYZ");
    });

    it("Should not allow unauthorized users to add organization", async function () {
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com", 
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };

      try {
        await workHistory.write.addOrganization([newOrgData], {
          account: employee.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Not authorized"));
      }
    });

    it("Should not allow adding duplicate organization", async function () {
      const newOrgData = {
        orgName: "StartupXYZ", 
        orgWebsite: "https://startupxyz.com",
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };

      await workHistory.write.addOrganization([newOrgData]);
      
      try {
        await workHistory.write.addOrganization([newOrgData]);
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Organization already exists"));
      }
    });
  });

  describe("Organization Verification", function () {
    beforeEach(async function () {
      // Add a new organization to verify
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com",
        physicalAddress: "789 Startup Ave, NYC, NY", 
        orgWalletAddress: newOrg.account.address
      };
      await workHistory.write.addOrganization([newOrgData]);
    });

    it("Should allow trusted organization to verify new organization", async function () {
      const beforeBlockNumber = await publicClient.getBlockNumber();
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg1.account
      });
      
      const events = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "OrganizationVerified",
        fromBlock: beforeBlockNumber + 1n,
        strict: true,
      });
      
      assert.equal(events.length, 1);

      const verificationCount = await workHistory.read.getVerificationCount([newOrg.account.address]);
      assert.equal(verificationCount, 1n);

      const hasVerified = await workHistory.read.hasVerified([newOrg.account.address, trustedOrg1.account.address]);
      assert.equal(hasVerified, true);
    });

    it("Should trust organization after reaching verification threshold", async function () {
      // Now we have 3 trusted organizations from constructor, so we can verify newOrg directly
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg1.account
      });
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg2.account
      });
      
      const beforeBlockNumber = await publicClient.getBlockNumber();
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg3.account
      });
      
      const events = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "OrganizationTrusted",
        fromBlock: beforeBlockNumber + 1n,
        strict: true,
      });
      
      assert.equal(events.length, 1);

      const org = await workHistory.read.organizations([newOrg.account.address]);
      assert.equal(org[4], true); // isTrusted should be true
    });

    it("Should not allow untrusted organization to verify", async function () {
      try {
        await workHistory.write.verifyOrganization([newOrg.account.address], {
          account: employee.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Only trusted organizations can verify"));
      }
    });

    it("Should not allow double verification from same organization", async function () {
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg1.account
      });

      try {
        await workHistory.write.verifyOrganization([newOrg.account.address], {
          account: trustedOrg1.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Already verified by this organization"));
      }
    });
  });

  describe("Employee Management", function () {
    it("Should allow trusted organization to register employee", async function () {
      const beforeBlockNumber = await publicClient.getBlockNumber();
      await workHistory.write.registerEmployee([employee.account.address], {
        account: trustedOrg1.account
      });
      
      const events = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "EmployeeRegistered",
        fromBlock: beforeBlockNumber + 1n,
        strict: true,
      });
      
      assert.equal(events.length, 1);

      const isRegistered = await workHistory.read.registeredEmployees([employee.account.address]);
      assert.equal(isRegistered, true);
    });

    it("Should not allow untrusted organization to register employee", async function () {
      try {
        await workHistory.write.registerEmployee([employee.account.address], {
          account: newOrg.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Only trusted organizations can register employees"));
      }
    });
  });

  describe("Document Management", function () {
    const documentHash = keccak256(encodePacked(["string"], ["Sample Document Content"]));

    beforeEach(async function () {
      // Register employee first
      await workHistory.write.registerEmployee([employee.account.address], {
        account: trustedOrg1.account
      });
    });

    it("Should allow trusted organization to add document for registered employee", async function () {
      const beforeBlockNumber = await publicClient.getBlockNumber();
      await workHistory.write.addDocument([employee.account.address, documentHash], {
        account: trustedOrg1.account
      });
      
      const events = await publicClient.getContractEvents({
        address: workHistory.address,
        abi: workHistory.abi,
        eventName: "DocumentAdded",
        fromBlock: beforeBlockNumber + 1n,
        strict: true,
      });
      
      assert.equal(events.length, 1);

      const documents = await workHistory.read.getUserDocuments([employee.account.address]);
      assert.equal(documents.length, 1);
      assert.equal(documents[0].documentHash, documentHash); // documentHash
      assert.equal(documents[0].addedBy.toLowerCase(), trustedOrg1.account.address.toLowerCase()); // addedBy
    });

    it("Should not allow untrusted organization to add document", async function () {
      try {
        await workHistory.write.addDocument([employee.account.address, documentHash], {
          account: newOrg.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Only trusted organizations can add documents"));
      }
    });

    it("Should not allow adding document for unregistered employee", async function () {
      try {
        await workHistory.write.addDocument([accounts[7].account.address, documentHash], {
          account: trustedOrg1.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Employee not registered"));
      }
    });

    it("Should return empty array for user with no documents", async function () {
      const documents = await workHistory.read.getUserDocuments([accounts[7].account.address]);
      assert.equal(documents.length, 0);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Add a pending organization
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com",
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };
      await workHistory.write.addOrganization([newOrgData]);
    });

    it("Should return pending organizations", async function () {
      const pendingOrgs = await workHistory.read.getPendingOrganizations();
      assert.equal(pendingOrgs.length, 1);
      assert.equal(pendingOrgs[0].toLowerCase(), newOrg.account.address.toLowerCase());
    });

    it("Should return correct verification count", async function () {
      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg1.account
      });

      const count = await workHistory.read.getVerificationCount([newOrg.account.address]);
      assert.equal(count, 1n);
    });

    it("Should return correct verification status", async function () {
      const hasVerifiedBefore = await workHistory.read.hasVerified([newOrg.account.address, trustedOrg1.account.address]);
      assert.equal(hasVerifiedBefore, false);

      await workHistory.write.verifyOrganization([newOrg.account.address], {
        account: trustedOrg1.account
      });

      const hasVerifiedAfter = await workHistory.read.hasVerified([newOrg.account.address, trustedOrg1.account.address]);
      assert.equal(hasVerifiedAfter, true);
    });
  });

  describe("Owner Functions", function () {
    beforeEach(async function () {
      // Add a non-constructor organization
      const newOrgData = {
        orgName: "StartupXYZ",
        orgWebsite: "https://startupxyz.com", 
        physicalAddress: "789 Startup Ave, NYC, NY",
        orgWalletAddress: newOrg.account.address
      };
      await workHistory.write.addOrganization([newOrgData]);
    });

    it("Should allow owner to remove non-constructor organization", async function () {
      await workHistory.write.removeOrganization([newOrg.account.address]);

      const org = await workHistory.read.organizations([newOrg.account.address]);
      assert.equal(org[0], ""); // orgName should be empty after deletion
    });

    it("Should not allow owner to remove constructor organization", async function () {
      try {
        await workHistory.write.removeOrganization([trustedOrg1.account.address]);
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Cannot remove constructor organizations"));
      }
    });

    it("Should not allow non-owner to remove organization", async function () {
      try {
        await workHistory.write.removeOrganization([newOrg.account.address], {
          account: trustedOrg1.account
        });
        assert.fail("Should have thrown an error");
      } catch (error: any) {
        assert(error.message.includes("Only owner"));
      }
    });
  });

  describe("Constants and Thresholds", function () {
    it("Should have correct verification threshold", async function () {
      const threshold = await workHistory.read.VERIFICATION_THRESHOLD();
      assert.equal(threshold, 3n);
    });
  });
});
