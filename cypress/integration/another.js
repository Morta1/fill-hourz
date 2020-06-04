describe('should fill hours', () => {
    before(() => {
        // generic calculation of hours from xls file
        cy.calcHours().then(value => cy.wrap(value).as('hours'));
    })
    it('filling hours for another', function () {
        expect(1).to.eq(1);
    });
})      