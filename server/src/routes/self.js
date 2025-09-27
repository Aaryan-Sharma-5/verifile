import express from 'express';
import { selfBackendVerifier } from '../config/selfVerifier.js';
import { verifyMetaMaskSignature } from '../middleware/metamaskAuth.js';

const router = express.Router();

// Self.xyz verification endpoint
router.post("/", async (req, res) => {
  console.log("Received Self.xyz verification request:", req.body);
  
  try {
    // Extract data from the request
    const { attestationId, proof, publicSignals, userContextData } = req.body;

    // Verify all required fields are present
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return res.json({
        status: "error",
        result: false,
        reason: "Proof, publicSignals, attestationId and userContextData are required",
        error_code: "MISSING_REQUIRED_FIELDS"
      });
    }

    console.log("Verifying proof with attestationId:", attestationId);
    console.log("UserContextData (hex):", userContextData);

    // Decode userContextData from hex to plain text
    let decodedUserData = null;
    let walletAddress = null;
    let signature = null;
    let message = null;

    try {
      // Remove '0x' prefix if present
      const hexString = userContextData.startsWith('0x') ? userContextData.slice(2) : userContextData;
      
      // Convert hex to string
      decodedUserData = Buffer.from(hexString, 'hex').toString('utf8');
      console.log("Decoded userContextData:", decodedUserData);
      
      // Split by ":" to get [address, signature, message]
      const parts = decodedUserData.split(':');
      if (parts.length === 3) {
        walletAddress = parts[0];
        signature = parts[1];
        message = parts[2];
        
        console.log("Extracted wallet address:", walletAddress);
        console.log("Extracted signature:", signature);
        console.log("Extracted message:", message);
      } else {
        console.warn("UserContextData format unexpected. Expected 3 parts separated by ':', got:", parts.length);
      }
    } catch (decodeError) {
      console.error("Failed to decode userContextData:", decodeError);
      return res.json({
        status: "error",
        result: false,
        reason: "Failed to decode userContextData",
        error_code: "DECODE_ERROR"
      });
    }

    // Verify MetaMask signature if we have all required data
    let metamaskVerified = false;
    if (walletAddress && signature && message) {
      console.log("🔐 Verifying MetaMask signature...");
      
      try {
        const metamaskVerification = await verifyMetaMaskSignature(walletAddress, message, signature);
        
        if (metamaskVerification.success && metamaskVerification.isValid) {
          metamaskVerified = true;
          console.log("✅ MetaMask signature verified successfully");
          console.log("Recovered address:", metamaskVerification.recoveredAddress);
          console.log("Provided address:", metamaskVerification.providedAddress);
        } else {
          console.log("❌ MetaMask signature verification failed:", metamaskVerification.error);
          return res.json({
            status: "error",
            result: false,
            reason: "MetaMask signature verification failed",
            error_code: "METAMASK_VERIFICATION_FAILED",
            details: metamaskVerification
          });
        }
      } catch (metamaskError) {
        console.error("Error during MetaMask verification:", metamaskError);
        return res.json({
          status: "error",
          result: false,
          reason: "MetaMask signature verification error",
          error_code: "METAMASK_VERIFICATION_ERROR"
        });
      }
    } else {
      console.warn("⚠️ Incomplete wallet data - skipping MetaMask verification");
    }

    // Verify the proof using SelfBackendVerifier
    const result = await selfBackendVerifier.verify(
      attestationId,    // Document type (1 = passport, 2 = EU ID card, 3 = Aadhaar)
      proof,            // The zero-knowledge proof
      publicSignals,    // Public signals array
      userContextData   // User context data (hex string)
    );

    console.log("Verification result:", result);

    // Check if verification was successful
    if (result.isValidDetails.isValid) {
      // Verification successful - process the result
      console.log("✅ Self.xyz verification successful for user:", walletAddress);
      
      // You can now use the extracted wallet data for further processing
      // For example, link the verified identity to the wallet address
      console.log("🔗 Linking verified identity to wallet:", walletAddress);
      console.log("📝 MetaMask signature verified:", metamaskVerified);
      
      return res.json({
        status: "success",
        result: true,
        credentialSubject: result.discloseOutput,
        walletData: {
          address: walletAddress,
          signature: signature,
          message: message,
          metamaskVerified: metamaskVerified
        },
        verification: {
          selfxyzVerified: true,
          metamaskVerified: metamaskVerified,
          fullyVerified: metamaskVerified 
        }
      });
    } else {
      // Verification failed
      console.log("❌ Self.xyz verification failed:", result.isValidDetails);
      return res.json({
        status: "error",
        result: false,
        reason: "Verification failed",
        error_code: "VERIFICATION_FAILED",
        details: result.isValidDetails,
      });
    }
  } catch (error) {
    console.error("❌ Error during Self.xyz verification:", error);
    return res.json({
      status: "error",
      result: false,
      reason: error instanceof Error ? error.message : "Unknown error",
      error_code: "UNKNOWN_ERROR"
    });
  }
});

export default router;