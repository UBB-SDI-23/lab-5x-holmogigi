describe("Bodybuilders", () => {
    describe("on opening the list of bodybuilders", () => {
        it("should show the bodybuilders in the database", () => {
            cy.intercept("GET", "**/api/Bodybuilders/**", {
                fixture: "bodybuilder.json",
            });

            cy.visit("http://localhost:5173/courses");
            cy.get('[data-testid="test-all-bodybuilders-container"]').should(
                "exist"
            );
        });
    });
});

export { };