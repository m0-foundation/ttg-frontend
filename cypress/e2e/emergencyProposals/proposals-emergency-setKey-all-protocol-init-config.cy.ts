describe("Emergency Proposals: set protocol config", () => {
  const proposalUrl = "";
  const descriptions: string[] = [];
  const keys: string[] = [];
  const values: string[] = [];

  it("connect first", () => {
    cy.visit("/proposal/create");
    cy.connectWallet();
  });

  it("I should be able to CREATE a proposal - Update collateral interval", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    cy.contains("Update collateral interval").click();

    const value = "86400";
    const key = "update_collateral_interval";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - Update collateral threshold ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    cy.contains("Update collateral threshold").click();

    const value = "1";
    const key = "update_collateral_threshold";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - Penalty rate ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Penalty rate").click();

    const value = "10";
    const key = "penalty_rate";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push("1000"); // in bps

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CAST vote YES for the proposal", () => {
    cy.castYesAllEmergencyProposals();
  });

  it("I should be able to EXECUTE the proposal of ADD to a list", () => {
    cy.executeAllProposals();
  });

  it("I should be able to CREATE a proposal - Mint delay ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Mint delay").click();

    const value = "14400";
    const key = "mint_delay";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - Mint TTL ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Mint TTL").click();

    const value = "3600";
    const key = "mint_ttl";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CAST vote YES for the proposal", () => {
    cy.castYesAllEmergencyProposals();
  });

  it("I should be able to EXECUTE the proposal of ADD to a list", () => {
    cy.executeAllProposals();
  });

  it("I should be able to CREATE a proposal - Mint ratio ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Mint ratio").click();

    const value = "90";
    const key = "mint_ratio";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push("9000"); // in bps

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - Minter freeze time ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Minter freeze time").click();

    const value = "43200";
    const key = "minter_freeze_time";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - base_minter_rate", () => {
    cy.visit("/proposal/create");

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Base minter rate").click();

    const value = "10";
    const key = "base_minter_rate";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push("1000"); // in bps

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CAST vote YES for the proposal", () => {
    cy.castYesAllEmergencyProposals();
  });

  it("I should be able to EXECUTE the proposal of ADD to a list", () => {
    cy.executeAllProposals();
  });

  it("I should be able to CREATE a proposal - max_earner_rate", () => {
    cy.visit("/proposal/create");

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Max earner rate").click();

    const value = "10";
    const key = "max_earner_rate";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push("1000"); // in bps

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - Minter rate model ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Minter rate model").click();

    const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const key = "minter_rate_model";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - earner rate model ", () => {
    cy.visit("/proposal/create");
    // cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='menuEmergency']").click();

    cy.get("[data-test='emergencySetKey']").click({ force: true });

    cy.contains("Update protocol config").click();

    cy.get("[data-test='protocolConfigSelect']").should("exist");
    cy.get("[data-test='protocolConfigSelect']").click();

    // config
    cy.contains("Earner rate model").click();

    const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const key = "earner_rate_model";
    const description = `Add protocol config ${key} = ${value}`;
    descriptions.push(description);
    keys.push(key);
    values.push(value);

    cy.get("input[data-test='proposalValue2']").type(value);
    cy.get("input[data-test='title']").type(description);
    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CAST vote YES for the proposal", () => {
    cy.castYesAllEmergencyProposals();
  });

  it("I should be able to EXECUTE the proposal of ADD to a list", () => {
    cy.executeAllProposals();
  });
});
