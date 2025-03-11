describe('Zero: reset power', () => {
  const title = 'Reset Power'
  const description = 'Test proposal to reset power governor'
  const tableSelector = 'powerToken-value'

  let oldGovernor = ''
  let newGovernor = ''

  it('Get old Governor', () => {
    cy.visit('/config/governance')
    cy.get(`[data-test="${tableSelector}"]`).then(($el) => {
      oldGovernor = $el.text()
      cy.log('Old governor', oldGovernor)
      cy.validateEthAddress(oldGovernor)
    })
  })

  it('I should be able to CREATE a proposal to Reset', () => {
    // zero proposals cant be created on first epoch
    cy.mineEpochs(2)

    cy.visit('/proposal/create')
    cy.connectWallet()

    cy.get("[data-test='proposalTypeSelect']").should('exist').click()

    cy.get("[data-test='menuReset']").click()
    cy.get("[data-test='resetToPowerHolders']").click()

    cy.get("input[data-test='proposalValue']").should('not.exist')

    cy.get("input[data-test='title']").type(title)
    cy.createProposalAddDescription(description)

    cy.clickPreviewProposal()

    cy.clickSubmitProposal()
  })

  it('I should be able to ACCESS the proposal', () => {
    // @todo: is this tho correct url?
    cy.visit('/proposals/zero')

    cy.contains(description).should('exist')

    cy.contains('article', description).then(($proposal) => {
      cy.wrap($proposal)
        .find("[data-test='proposal-button-show-details']")
        .click({ force: true })
    })

    cy.url().should('match', /proposal\/([0-9])\w+/g)
    cy.contains('.markdown-body', description).should('exist')
    cy.wait(500) // wait to load props values
  })

  it('I should be able to CAST vote YES for the proposal', () => {
    cy.castYesOneOptionalProposal(description, 'zero')
  })

  it('I should be able to EXECUTE the proposal of ADD to a list', () => {
    cy.reload()
    cy.visit('/proposals/succeeded')
    cy.connectWallet()

    cy.contains('article', description).then(($proposal) => {
      cy.wrap($proposal).find('#button-proposal-execute').click()
    })

    cy.wait(500)
  })

  it('I should be able to check the executed proposal', () => {
    cy.visit('/config/governance')

    cy.get(`[data-test="${tableSelector}"]`).then(($el) => {
      newGovernor = $el.text()
      cy.log(newGovernor)
      cy.validateEthAddress(newGovernor)
    })

    cy.then(() => {
      expect(newGovernor).to.not.equal(oldGovernor)
    })
  })
})
