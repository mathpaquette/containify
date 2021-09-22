describe('containify-host', () => {
  beforeEach(() => cy.visit('/'));

  it('should', () => {
    cy.get('.header').contains('[app1] route1').click();
    cy.url().should('include', '/apps/remote-app1/route1/route?query=query1');
  });
});
