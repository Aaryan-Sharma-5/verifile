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
  
  const workHistory = m.contract("WorkHistory", [constructorOrgs]);

  return { workHistory };
});

export default WorkHistoryModule;
