describe('Delegate', () => {
  const account1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

  it('Mine to Transfer period', () => {
    cy.mineEpochs(2) // mine 1 epoch until transfer epoch to be able to delegate
  })

  it('Delegate Power tokens', () => {
    cy.delegatePower(account1)
  })

  it('Delegate Zero tokens', () => {
    cy.delegateZero(account1)
  })
})
