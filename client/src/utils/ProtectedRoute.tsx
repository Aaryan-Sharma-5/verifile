import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

interface ProtectedRouteProps {
  element: ReactElement;
  actor: "org" | "employee";
  redirectOnSuccess?: string;
  redirectOnFailure?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  actor,
  redirectOnSuccess,
  redirectOnFailure,
}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window.ethereum !== "undefined") {
        setMetaMaskInstalled(true);
        authenticateUser();
      } else {
        setMetaMaskInstalled(false);
        setIsLoading(false);
        const interval = setInterval(() => {
          if (typeof window.ethereum !== "undefined") {
            clearInterval(interval);
            setMetaMaskInstalled(true);
            setIsLoading(true);
            authenticateUser();
          }
        }, 5000);
      }
    };

    const authenticateUser = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const message =
          "Welcome! Please sign this message to verify your identity.";

        const signature = await signer.signMessage(message);

        const response = await axios.post("http://localhost:8080/api/auth", {
          address,
          message,
          signature,
          actor,
        });

        if (response.status >= 200 && response.status < 300) {
          setIsAuthenticated(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Authentication failed", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkMetaMask();
  }, [navigate, actor]);

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: "#242424",
          color: "#fff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!metaMaskInstalled) {
    return (
      <div
        style={{
          backgroundColor: "#242424",
          color: "#fff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        MetaMask is not installed. Please install it to continue. Checking
        again in 5 seconds...
      </div>
    );
  }

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;