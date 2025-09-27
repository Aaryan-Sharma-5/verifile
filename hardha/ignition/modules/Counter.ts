import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WorkHistoryModule = buildModule("WorkHistoryModule", (m) => {
  const constructorOrgs = ["Org1", "Org2"]; // Example constructor organizations
  const workHistory = m.contract("WorkHistory", [constructorOrgs]);

  return { workHistory };
});

export default WorkHistoryModule;
