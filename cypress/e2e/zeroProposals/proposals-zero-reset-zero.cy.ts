describe('Zero: reset Zero', () => {
  const title = 'Reset Zero'
  const description = 'Test proposal to reset zero governor'
  const tableSelector = 'zeroToken-value'

  let oldTokenAddr = ''
  let newTokenAddr = ''

  it('Get old token address', () => {
    cy.visit('/config/governance')
    cy.get(`[data-test="${tableSelector}"]`)
      .last()
      .then(($el) => {
        oldTokenAddr = $el.text()
        cy.log(oldTokenAddr)
        cy.validateEthAddress(oldTokenAddr)
      })
  })

  it('I should be able to CREATE a proposal to Reset', () => {
    // zero proposals cant be created on first epoch
    cy.mineEpochs(2)

    cy.visit('/proposal/create')
    cy.connectWallet()

    cy.get("[data-test='proposalTypeSelect']").should('exist').click()

    cy.get("[data-test='menuReset']").click()
    cy.get("[data-test='resetToZeroHolders']").click()

    cy.get("input[data-test='proposalValue']").should('not.exist')

    cy.get("input[data-test='title']").type(title)
    cy.createProposalAddDescription(description)

    cy.clickPreviewProposal()

    cy.clickSubmitProposal()
  })

  it('I should be able to ACCESS the proposal', () => {
    // reset does not need to forward to next epoch, it will be able to vote on same epoch
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
})
