import { rpcClient } from './rpc.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the contract ABI
const contractArtifactPath = path.resolve(__dirname, '../../../hardhat/artifacts/contracts/WorkHistory.sol/WorkHistory.json');
let contractABI;
let contractAddress;

try {
    const artifact = JSON.parse(fs.readFileSync(contractArtifactPath, 'utf8'));
    contractABI = artifact.abi;
    
    // Use the contract address from environment variables
    contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
} catch (error) {
    console.error('Error loading contract artifact:', error);
    contractABI = [];
}

/**
 * Check if an address exists as an organization or employee on the blockchain
 * @param {string} address - The wallet address to check
 * @returns {Promise<{whatExists: 'None' | 'employee' | 'org'}>}
 */
export async function checkAddressType(address) {
    try {
        // Check if address exists as an organization
        const orgCheckResult = await rpcClient.callContract(
            contractAddress,
            contractABI,
            'checkIfOrgExists',
            [address]
        );

        if (orgCheckResult.success && orgCheckResult.data === true) {
            return { whatExists: 'org' };
        }

        // Check if address exists as an employee
        const employeeCheckResult = await rpcClient.callContract(
            contractAddress,
            contractABI,
            'checkIfEmployeeExists',
            [address]
        );

        if (employeeCheckResult.success && employeeCheckResult.data === true) {
            return { whatExists: 'employee' };
        }

        // If neither exists, return None
        return { whatExists: 'None' };

    } catch (error) {
        console.error('Error checking address type:', error);
        // Return None in case of error to maintain consistent response format
        return { whatExists: 'None' };
    }
}

/**
 * Make a signed call to the blockchain as the fluence backend
 * This simulates the fluence backend making the call
 * @param {string} address - The wallet address to check
 * @returns {Promise<{whatExists: 'None' | 'employee' | 'org'}>}
 */
export async function checkAddressTypeAsFluenceBackend(address) {
    try {
        // Use the private key from environment to sign the call
        // This simulates the fluence backend making a signed call
        const signedClient = rpcClient;
        
        console.log(`Fluence backend checking address: ${address}`);
        console.log(`Using contract at: ${contractAddress}`);
        
        // Check if address exists as an organization first
        const orgCheckResult = await signedClient.callContract(
            contractAddress,
            contractABI,
            'checkIfOrgExists',
            [address]
        );

        console.log('Organization check result:', orgCheckResult);

        if (orgCheckResult.success && orgCheckResult.data === true) {
            return { whatExists: 'org' };
        }

        // Check if address exists as an employee
        const employeeCheckResult = await signedClient.callContract(
            contractAddress,
            contractABI,
            'checkIfEmployeeExists',
            [address]
        );

        console.log('Employee check result:', employeeCheckResult);

        if (employeeCheckResult.success && employeeCheckResult.data === true) {
            return { whatExists: 'employee' };
        }

        // If neither exists, return None
        return { whatExists: 'None' };

    } catch (error) {
        console.error('Error in fluence backend address check:', error);
        // Return None in case of error to maintain consistent response format
        return { whatExists: 'None' };
    }
}