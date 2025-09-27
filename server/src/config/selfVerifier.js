import { SelfBackendVerifier, AllIds, DefaultConfigStore } from '@selfxyz/core';

// Initialize SelfBackendVerifier with configuration matching the frontend
export const selfBackendVerifier = new SelfBackendVerifier(
  "verifile-app", // scope - matches the frontend scope
  "https://unrecollective-anabel-debentured.ngrok-free.dev/api/self", // endpoint - your ngrok URL
  false, // mockPassport: true = staging/testnet (set to false for mainnet)
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [], // matches frontend configuration
    ofac: false, // matches frontend configuration
  }),
  "hex" // userIdentifierType - matches frontend userIdType
);