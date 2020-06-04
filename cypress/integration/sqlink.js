describe('should fill hours', () => {
    before(() => {
        // generic calculation of hours from xls file
        cy.calcHours().then(value => cy.wrap(value).as('hours'));
    })
    it('filling hours for sqlink', function () {
        cy.visit(Cypress.env('url'));
        // fill user/password
        cy.get('#useridInput').click().type(Cypress.env('username'));
        cy.get('#it2').click().type(Cypress.env('password'));
        cy.get('#loginButton').click();
        // go to the actual report
        cy.scrollTo('topRight');
        cy.get('#pt1\\:j_id7').click({ force: true });
        cy.get('#pt1\\:timesheet__31410110').click();
        // iterate through all days of the month and fill the hours
        cy.get('@hours').each((data, index) => {
            if (data && data.in && data.out) {
                cy.get(`#pt1\\:dataTable\\:${index}\\:clockInTime`).click().type(data.in);
                cy.get(`#pt1\\:dataTable\\:${index}\\:clockOutTime`).click().type(data.out);
            }
        })
        cy.get('#pt1\\:saveButton').click();
    });
});  