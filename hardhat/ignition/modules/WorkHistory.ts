import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WorkHistoryModule = buildModule("WorkHistoryModule", (m) => {
  // Define example constructor organizations with proper structure
  const constructorOrgs = [
    {
      orgName: "TechCorp Inc",
      orgWebsite: "https://techcorp.com",
      physicalAddress: "123 Tech Street, Silicon Valley, CA",
      orgWalletAddress: "0x1234567890123456789012345678901234567890"
    },
    {
      orgName: "InnovateLabs",
      orgWebsite: "https://innovatelabs.io",
      physicalAddress: "456 Innovation Blvd, Austin, TX",
      orgWalletAddress: "0x2345678901234567890123456789012345678901"
    }
  ];
  
  // Define the Fluence backend address (replace with actual address when available)
  const fluenceBackendAddress = "0xDCeFdee35A355715924C100870a5689b06c2dd95"; // Placeholder address
  
  const workHistory = m.contract("WorkHistory", [constructorOrgs, fluenceBackendAddress]);

  return { workHistory };
});

export default WorkHistoryModule;
