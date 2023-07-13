let proposalUrl = "";
let listAddress = "";

describe("Proposals", () => {
  describe("type action Emergency Operation: remove", () => {
    describe("Create the list", () => {
      const input = "Collateral Managers";
      const description = "Create the Collateral Managers list";

      it("I should be able to CREATE a proposal to create a list", () => {
        cy.visit("http://localhost:3000/proposals/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("List").click();
        cy.contains("Create a new list").should("exist");
        cy.contains("Create a new list").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type(input);

        cy.get("textarea[name='description']").type(description);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 4);
        });
      });

      it("I should be able to DELEGATE", () => {
        cy.visit("http://localhost:3000/proposals/active");
        cy.connectWallet();
        cy.reload();
        // delegate to self account before voting to have vote power
        cy.delegateVote();
      });

      it("I should be able to ACCESS the ACTIVE proposal", () => {
        // forward in time to be able to vote
        cy.task("mine", 100).then((obj) => {
          console.log("mined", { obj });
        });

        cy.wait(1000);
        cy.visit("http://localhost:3000/proposals/active");

        cy.contains(description).should("exist");

        cy.contains("article", description).then(($proposal) => {
          expect($proposal.find(".active")).to.contain("active");
          expect($proposal.find("a")).to.contain("show details");
          cy.wrap($proposal).find("a").click();
        });

        cy.url().should("match", /proposals\/([0-9])\w+/g);
        cy.contains(".markdown-body", description).should("exist");
        cy.wait(500); // wait to load props values

        cy.get("#technical-proposal-incoming-change")
          .invoke("text")
          .should("be.a", "string")
          .should("have.length", 42);

        cy.get("#technical-proposal-incoming-change")
          .invoke("text")
          .then((text) => {
            listAddress = text;
          });

        cy.url().then((url) => {
          proposalUrl = url;
        });
      });

      it("I should be able to CAST vote YES for the proposal of Create a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();
        cy.wait(1000);

        cy.get("#vote-yes-percentage").should("contain", "0%");
        cy.get("#button-cast-yes").click();
        cy.task("mine", 5);
        cy.reload();
        cy.get("#vote-yes-percentage").should("contain", "100%");
      });

      it("I should be able to EXECUTE the proposal of Create a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();

        cy.task("mine", 100);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "succeeded");
        cy.contains("article", "Execute?").should("exist");
        cy.get("#button-proposal-execute").click();
        cy.wait(500);

        cy.task("mine", 10);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "executed");
      });
    });

    describe("Append an Address to the list", () => {
      const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      const description = "Append to list";

      it("I should be able to CREATE a proposal to APPEND an address to a list", () => {
        cy.log(listAddress);
        cy.visit("http://localhost:3000/proposals/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("List").click();
        cy.contains("Append to a list").should("exist").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        // list address
        cy.get("input[data-test='proposalValue']").type(listAddress);
        // address to append
        cy.get("input[data-test='proposalValue2']").type(input1);

        cy.get("textarea[name='description']").type(description);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("I should be able to ACCESS the ACTIVE proposal", () => {
        // forward in time to be able to vote
        cy.task("mine", 100).then((obj) => {
          console.log("mined", { obj });
        });

        cy.wait(1000);
        cy.visit("http://localhost:3000/proposals/active");

        cy.contains(description).should("exist");

        cy.contains("article", description).then(($proposal) => {
          expect($proposal.find(".active")).to.contain("active");
          expect($proposal.find("a")).to.contain("show details");
          cy.wrap($proposal).find("a").click();
        });

        cy.url().should("match", /proposals\/([0-9])\w+/g);
        cy.contains(".markdown-body", description).should("exist");
        cy.wait(500); // wait to load props values

        cy.get("#technical-proposal-incoming-change").should("contain", input1);

        cy.url().then((url) => {
          proposalUrl = url;
        });
      });

      it("I should be able to CAST vote YES for the proposal of Append to a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();
        cy.wait(1000);

        cy.get("#vote-yes-percentage").should("contain", "0%");
        cy.get("#button-cast-yes").click();
        cy.task("mine", 5);
        cy.reload();
        cy.get("#vote-yes-percentage").should("contain", "100%");
      });

      it("I should be able to EXECUTE the proposal of Append to a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();

        cy.task("mine", 100);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "succeeded");
        cy.contains("article", "Execute?").should("exist");
        cy.get("#button-proposal-execute").click();
        cy.wait(500);

        cy.task("mine", 10);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "executed");
      });
    });

    describe("Emergency Remove the Address from the list", () => {
      const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      const description = "Remove the address from the list";

      it("I should be able to CREATE a proposal to REMOVE an address to a list", () => {
        cy.log(listAddress);
        cy.visit("http://localhost:3000/proposals/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Emergency").should("exist").click({ force: true });

        cy.contains("Emergency Remove from a list").should("exist");
        cy.contains("Emergency Remove from a list").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        // list address
        cy.get("input[data-test='proposalValue']").type(listAddress);
        // address to remove
        cy.get("input[data-test='proposalValue2']").type(input1);

        cy.get("textarea[name='description']").type(description);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("I should be able to ACCESS the ACTIVE proposal", () => {
        // emergency does not need to forward to next epoch, it will be able to vote on same epoch
        cy.task("mine", 5);
        cy.reload();
        cy.visit("http://localhost:3000/proposals/emergency");

        cy.contains(description).should("exist");

        // from active page go to proposal page
        cy.contains("article", description).then(($proposal) => {
          expect($proposal.find(".active")).to.contain("active");
          expect($proposal.find("a")).to.contain("show details");
          cy.wrap($proposal).find("a").click();
        });

        cy.url().should("match", /proposals\/([0-9])\w+/g);
        cy.contains(".markdown-body", description).should("exist");
        cy.wait(500); // wait to load props values

        cy.get("#technical-proposal-incoming-change").should("contain", input1);
        cy.get("#technical-proposal-incoming-change").should(
          "contain",
          listAddress
        );

        cy.url().then((url) => {
          proposalUrl = url;
        });
      });

      it("I should be able to CAST vote YES for the proposal of Remove from a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();
        cy.wait(1000);

        cy.get("#vote-yes-percentage").should("contain", "0%");
        cy.get("#button-cast-yes").click();
        cy.task("mine", 5);
        cy.reload();
        cy.get("#vote-yes-percentage").should("contain", "100%");
      });

      it("I should be able to EXECUTE the proposal of Remove from a list", () => {
        cy.visit(proposalUrl);
        cy.connectWallet();

        cy.task("mine", 100);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "succeeded");
        cy.contains("article", "Execute?").should("exist");
        cy.get("#button-proposal-execute").click();
        cy.wait(500);

        cy.task("mine", 10);
        cy.wait(500);
        cy.reload();

        cy.get("#proposal-state").should("contain", "executed");
      });
    });
  });
});
