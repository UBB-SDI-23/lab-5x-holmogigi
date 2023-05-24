describe("Coaches", () => {
    describe("on opening the list of coaches", () => {
        it("should show the coaches in the database", () => {
            cy.intercept("GET", "**/api/Coach/**", {
                fixture: "coaches.json",
            });

            cy.visit("http://localhost:5173/coaches");
            cy.get('[data-testid="test-all-coaches-container"]').should(
                "exist"
            );
        });
    });
});

export { };