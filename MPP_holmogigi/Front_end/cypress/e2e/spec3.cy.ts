describe("Gyms", () => {
    describe("on opening the list of gyms", () => {
        it("should show the gyms in the database", () => {
            cy.intercept("GET", "**/api/Gym/**", {
                fixture: "gyms.json",
            });

            cy.visit("http://localhost:5173/gyms");
            cy.get('[data-testid="test-all-gyms-container"]').should(
                "exist"
            );
        });
    });
});

export { };