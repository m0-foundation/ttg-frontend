describe('Governance configuration', () => {
  beforeEach(() => {
    cy.visit('/config/governance')
  })

  it('I should visit governance config page and see navigation', () => {
    cy.url().should('include', '/config/governance')

    cy.checkAppNavigation()
  })

  it('I should see all configuration parameters', () => {
    cy.get('h1').should('contain', 'Configs')

    cy.get('nav')
      .contains('Governance')
      .and('have.attr', 'href', '/config/governance')

    // changeable parameters
    const changeableConfigParams = [
      'Priority Proposal Threshold Ratio',
      'ZERO Proposal Threshold Ratio',
      'Proposal Fee',
      'Cash Token',
    ]

    cy.get('h3.text-xl').should('have.length', changeableConfigParams.length)

    changeableConfigParams.forEach((value: string) => {
      cy.get('h3.text-xl').contains(value)
    })

    const nonChangeableConfigParams = [
      'Standard Governor',
      'Emergency Governor',
      'POWER Token',
      'ZERO Governor',
      'ZERO Token',
      'Distribution Vault',
      'Registrar',
      'M Token',
      '$M (wrapped)',
    ]

    // non-changeable parameters table
    cy.get('table')
      .eq(0)
      .find('tbody tr')
      .should('have.length', nonChangeableConfigParams.length)

    nonChangeableConfigParams.forEach((value: string) => {
      cy.get('table').eq(0).find('tbody tr').contains(value)
    })
  })
})
