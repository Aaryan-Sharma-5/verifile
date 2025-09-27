import express from "express";
import { validateMetaMaskCredentials } from "./middleware/metamaskAuth.js";
import { checkAddressTypeAsFluenceBackend } from "./utils/contractUtils.js";
import cors from "cors";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "metamask-address",
      "metamask-message",
      "metamask-signature",
    ],
  })
);

// Authentication route for protected routes
app.post("/api/auth", validateMetaMaskCredentials, async (req, res) => {
  console.log("Received authentication request:", req.body);
  console.log("Verified MetaMask data:", req.metamask);

  try {
    // Make signed RPC call as fluence backend to check if org or employee exists
    const addressType = await checkAddressTypeAsFluenceBackend(
      req.metamask.address
    );

    console.log("Address type check result:", addressType);

    // Return the required JSON format
    console.log("Sending response javda:", addressType);
    res.json(addressType);
  } catch (error) {
    console.error("Error during blockchain address check:", error);

    // Return None in case of error to maintain consistent response format
    res.json({ whatExists: "None" });
  }
}); // Example route with required MetaMask validation
app.post("/api/self", (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Verified MetaMask data:", req.metamask);
  res.json({
    status: "success",
    result: true,
  });
});

// Health check route without MetaMask validation
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
