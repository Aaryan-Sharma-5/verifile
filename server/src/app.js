import express from 'express';

import { validateMetaMaskCredentials } from './middleware/metamaskAuth.js';
import { 
    checkAddressTypeAsFluenceBackend, 
    registerEmployee, 
    addOrganizationToWaitingList,
    checkOrgsPowerfulOrNot,
    verifyOrganization,
    getUsersData,
    getUserDocuments
} from './utils/contractUtils.js';

import cors from 'cors';

// Import configurations
import { corsConfig } from './config/cors.js';

// Import routes
import authRoutes from './routes/auth.js';
import selfRoutes from './routes/self.js';
import healthRoutes from './routes/health.js';

const app = express();

// Call startup tasks (commented out for now)
// startupTasks();  // dont call only for checking employee seeding

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/self", selfRoutes);
app.use("/api/health", healthRoutes);

app.post("/api/get-employee-dashboard-data", validateMetaMaskCredentials, async (req, res) => {
  console.log("Received employee dashboard request");
  console.log("Verified MetaMask data:", req.metamask);

  try {
    // Get the employee address from the validated MetaMask request
    const employeeAddress = req.metamask.address;

    // First check if the address exists as an employee
    const addressType = await checkAddressTypeAsFluenceBackend(employeeAddress);
    
    if (addressType.whatExists !== 'employee') {
      return res.status(403).json({
        success: false,
        error: "Access denied",
        message: "Address is not registered as an employee"
      });
    }

    console.log(`✅ Employee ${employeeAddress} verified, fetching dashboard data`);

    // Get comprehensive user data including documents and organizations
    const userDataResult = await getUsersData(employeeAddress);
    
    if (!userDataResult.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch employee data",
        message: userDataResult.error
      });
    }

    // Format the response data
    const dashboardData = {
      employeeAddress: employeeAddress,
      isRegistered: userDataResult.isRegistered,
      documentsCount: userDataResult.data.length,
      documents: userDataResult.data.map((item, index) => ({
        id: index,
        documentHash: item.documents[0].documentHash,
        timestamp: parseInt(item.documents[0].timestamp),
        addedBy: {
          address: item.documents[0].addedBy,
          orgName: item.organizationsThatAdded[0].orgName,
          orgWebsite: item.organizationsThatAdded[0].orgWebsite,
          physicalAddress: item.organizationsThatAdded[0].physicalAddress,
          isTrusted: item.organizationsThatAdded[0].isTrusted
        }
      }))
    };

    console.log(`✅ Successfully retrieved dashboard data for employee ${employeeAddress}`);
    console.log(`Found ${dashboardData.documentsCount} documents`);

    res.json({
      success: true,
      message: "Employee dashboard data retrieved successfully",
      data: dashboardData
    });

  } catch (error) {
    console.error("❌ Error during employee dashboard data retrieval:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
});

app.post("/api/add-org-to-waiting-list", async (req, res) => {
  const { orgName, orgWebsite, physicalAddress, orgWalletAddress } = req.body;
  
  console.log("Received organisation waitlist request:", req.body);

  try {
    // Validate required fields
    if (!orgName || !orgWebsite || !physicalAddress || !orgWalletAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Please provide orgName, orgWebsite, physicalAddress, and orgWalletAddress"
      });
    }

    // Add organization to waiting list using fluence backend private key
    const result = await addOrganizationToWaitingList({
      orgName,
      orgWebsite,
      physicalAddress,
      orgWalletAddress
    });

    if (result.success) {
      console.log(`✅ Successfully added organization ${orgName} to waiting list`);
      res.json({
        success: true,
        message: "Organization added to waiting list successfully",
        data: {
          transactionHash: result.data.transactionHash,
          orgName: orgName,
          orgWalletAddress: orgWalletAddress
        }
      });
    } else {
      console.log(`⚠️ Failed to add organization to waiting list: ${result.error}`);
      res.status(500).json({
        success: false,
        error: "Failed to add organization to waiting list",
        message: result.error
      });
    }

  } catch (error) {
    console.error("❌ Error during organization waitlist addition:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
});

app.post("/api/vote", validateMetaMaskCredentials, async (req, res) => {
  const { orgToVerifyAddress } = req.body;
  
  console.log("Received voting request:", req.body);
  console.log("Verified MetaMask data:", req.metamask);

  try {
    // Validate required fields
    if (!orgToVerifyAddress) {
      return res.status(400).json({
        success: false,
        error: "Missing required field",
        message: "Please provide orgToVerifyAddress"
      });
    }

    // Get the MetaMask address from the validated request
    const voterAddress = req.metamask.address;

    // Check if the voter address is one of the initial/powerful organizations
    const powerfulCheckResult = await checkOrgsPowerfulOrNot(voterAddress);

    if (!powerfulCheckResult.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to check organization power status",
        message: powerfulCheckResult.error
      });
    }

    if (!powerfulCheckResult.isPowerful) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
        message: "Only initial/powerful organizations can vote"
      });
    }

    console.log(`✅ Organization ${voterAddress} is authorized to vote`);

    // Register the vote by calling verifyOrganization
    const voteResult = await verifyOrganization(voterAddress, orgToVerifyAddress);

    if (voteResult.success) {
      console.log(`✅ Vote registered successfully: ${voterAddress} voted for ${orgToVerifyAddress}`);
      res.json({
        success: true,
        message: "Vote registered successfully",
        data: {
          voterAddress: voterAddress,
          orgToVerifyAddress: orgToVerifyAddress,
          transactionHash: voteResult.data.transactionHash
        }
      });
    } else {
      console.log(`⚠️ Failed to register vote: ${voteResult.error}`);
      res.status(500).json({
        success: false,
        error: "Failed to register vote",
        message: voteResult.error
      });
    }

  } catch (error) {
    console.error("❌ Error during voting process:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
})

export default app;
