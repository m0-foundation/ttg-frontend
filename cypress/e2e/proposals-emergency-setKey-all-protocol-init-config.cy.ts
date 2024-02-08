describe("Proposals", () => {
  describe("type action: setKey", () => {
    const proposalUrl = "";
    const descriptions: string[] = [];
    const keys: string[] = [];
    const values: string[] = [];

    it("I should be able to CREATE a proposal - Update collateral interval", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      cy.contains("Update collateral interval").click();

      const value = "86400";
      const key = "updateCollateral_interval";
      const description = `Add protocol config ${key} = ${value}`;
      descriptions.push(description);
      keys.push(key);
      values.push(value);

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Update collateral threshold ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      cy.contains("Update collateral threshold").click();

      const value = "1";
      const key = "updateCollateral_threshold";
      const description = `Add protocol config ${key} = ${value}`;
      descriptions.push(description);
      keys.push(key);
      values.push(value);

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Penalty rate ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

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
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Mint delay ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

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
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Mint TTL ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

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
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Mint ratio ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

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
      values.push("900000"); // in bps

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Minter freeze time ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

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
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - Minter rate model ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      // config
      cy.contains("Minter rate").click();

      const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      const key = "minter_rate_model";
      const description = `Add protocol config ${key} = ${value}`;
      descriptions.push(description);
      keys.push(key);
      values.push(value);

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal - earner rate model ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      // config
      cy.contains("Earner rate").click();

      const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      const key = "earner_rate_model";
      const description = `Add protocol config ${key} = ${value}`;
      descriptions.push(description);
      keys.push(key);
      values.push(value);

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesAllEmergencyProposals();
    });

    it("I should be able to EXECUTE the proposal", () => {
      const execute = (description) => {
        cy.visit("http://localhost:3000/proposals/succeeded");
        cy.connectWallet();

        cy.reload();

        cy.contains("article", description).then(($proposal) => {
          cy.wrap($proposal).find("#button-proposal-execute").click();
        });

        cy.wait(500);
      };

      execute(descriptions[0]);
      execute(descriptions[1]);
      execute(descriptions[2]);
      execute(descriptions[3]);
      execute(descriptions[4]);
      execute(descriptions[5]);
      execute(descriptions[6]);
      execute(descriptions[7]);
      execute(descriptions[8]);

      cy.mineEpochs(1);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit("http://localhost:3000/config/protocol");

      cy.get("table > tbody > tr").should("have.length", descriptions.length);

      const rowCells = (row) =>
        Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

      cy.get("table tbody tr").then((rows) => {
        const mapped = Cypress._.map(rows, rowCells)
          .map((row) => row.slice(0, 2))
          .sort();

        const should = [
          [keys[0].toLowerCase(), values[0]],
          [keys[1].toLowerCase(), values[1]],
          [keys[2].toLowerCase(), values[2]],
          [keys[3].toLowerCase(), values[3]],
          [keys[4].toLowerCase(), values[4]],
          [keys[5].toLowerCase(), values[5]],
          [keys[6].toLowerCase(), values[6]],
          [keys[7].toLowerCase(), values[7].toLowerCase()],
          [keys[8].toLowerCase(), values[8].toLowerCase()],
        ].sort();

        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
