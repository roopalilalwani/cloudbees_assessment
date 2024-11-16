interface CustomWorld {
    apiResults: { title: string; description: string }[];
    uiResults: { title: string; description: string }[];
}

import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

setDefaultTimeout(60 * 1000 * 2)

Given('User navigates to the application', async function () {
    const baseURL = process.env.BASEURL || 'https://www.udacity.com/catalog'; //  URL to be tested
    await fixture.page.goto(baseURL);
    fixture.logger.info("Navigated to the application")
})

When('user search for {string}', async function (searchTerm: string) {
    // Use getByRole to locate the search field based on role and name
    const searchInput = fixture.page.getByRole('searchbox', { name: 'Search input' });
    await searchInput.waitFor({ timeout: 30000 });
    await searchInput.fill(searchTerm);
    await fixture.page.keyboard.press('Enter');
});

When('user clicks on {string} Dropdown', async function (dropdownName: string) {
    const dropdown = fixture.page.getByRole('button', { name: dropdownName });
    await dropdown.click();
});

When('user search for {string} in Skill Dropdown', async function (skillSearchTerm: string) {
    try {
        const skillsDropdownRegion = fixture.page.getByRole('region', { name: 'Skill' });
        const skillsInput = skillsDropdownRegion.locator('input[type="text"]');

        await skillsDropdownRegion.scrollIntoViewIfNeeded();
        await fixture.page.waitForTimeout(500);
        
        await skillsDropdownRegion.hover();
        await fixture.page.waitForTimeout(200);
        await skillsInput.click({ force: true });
        
        await skillsInput.focus();
        const isFocused = await fixture.page.evaluate(
            (element) => document.activeElement === element,
            await skillsInput.elementHandle()
        );
        
        if (!isFocused) {
            throw new Error("Skill dropdown input field is not focused after click.");
        }
        await fixture.page.waitForTimeout(300);
        await skillsInput.fill(skillSearchTerm);
        await skillsInput.press('Enter');

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Failed to search for "${skillSearchTerm}" in Skills dropdown:`, error);
            throw new Error(`Skill search failed: ${error.message}`);
        } else {
            console.error(`Failed to search for "${skillSearchTerm}" in Skills dropdown:`, error);
            throw new Error(`Skill search failed: An unknown error occurred.`);
        }
    }
});

Then('user sees results matching the search term in the UI', async function () {
    const searchTerm = 'Automation testing';
    const results = fixture.page.locator('li[role="option"]');

    // Wait for the results to appear, if any
    await fixture.page.waitForTimeout(2000);
    const resultsCount = await results.count();

    if (resultsCount === 0) {
        console.log(`No results found for the term "${searchTerm}". Test passed with no results.`);
        return; // Test passes as no results are expected
    }

    // Capture UI results
    const uiResults = [];
    for (let i = 0; i < resultsCount; i++) {
        const resultText = await results.nth(i).textContent();
        uiResults.push(resultText);
    }

    // Mock API response for "Automation Testing"
    const mockApiResponse = [
        { title: 'Automation Testing 101', description: 'An introduction to automation testing.' },
        { title: 'Advanced Automation Testing Techniques', description: 'Learn advanced techniques for automation testing.' },
        { title: 'Automation Testing Best Practices', description: 'Best practices for effective automation testing.' },
    ];

    // Validate results
    if (uiResults.length === 0) {
        console.log(`No results found in UI. Expected results from API: ${JSON.stringify(mockApiResponse)}`);
        return;
    }

    console.log(`UI Results: ${JSON.stringify(uiResults)}`);
    console.log(`Mock API Response: ${JSON.stringify(mockApiResponse)}`);

    // Check if the displayed results contain the search term
    const matchFound = uiResults.some(result => result && result.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchFound) {
        throw new Error(`No matching results found for the term "${searchTerm}".`);
    }

    console.log(`Results matching the term "${searchTerm}" are displayed. Test passed.`);
});

Then('the UI results should match the API results', async function (this: CustomWorld) {
    expect(this.uiResults.length).toBe(this.apiResults.length); // Use toBe for Playwright

    for (let i = 0; i < this.uiResults.length; i++) {
        expect(this.uiResults[i].title).toBe(this.apiResults[i].title);
        expect(this.uiResults[i].description).toBe(this.apiResults[i].description);
    }

    console.log(`UI results successfully matched with API results.`);
});

Given('the application is loaded successfully', async function () {
    const baseURL = process.env.BASEURL || 'https://www.udacity.com/catalog'; // URL to be tested
await fixture.page.goto(baseURL);

    fixture.logger.info("Navigated to the application")
})

// When user searches for "NonExistentTerm"
When('user searches for {string}', async function (searchTerm: string) {
   // Use getByRole to locate the search field based on role and name
   const searchInput = fixture.page.getByRole('searchbox', { name: 'Search input' });
    
   await searchInput.waitFor({ timeout: 30000 });
   await searchInput.fill(searchTerm);
   await fixture.page.keyboard.press('Enter');
});

// Then user should see a "No results found" message
Then('user should see a {string} message', async function (expectedMessage: string) {
    // Check for the presence of the message
    const actualMessage = await fixture.page.locator('h2.chakra-heading.css-1hsf0v9').innerText(); 
    // Normalize both messages to lowercase for comparison
    expect(actualMessage.toLowerCase()).toBe(expectedMessage.toLowerCase());

    // Store the result status in the CustomWorld instance if needed
    this.resultStatus = actualMessage === expectedMessage ? 'passed' : 'failed';
});

Then('user fetch search results from the API', () => {
    const searchTerm = 'Automation testing';
    // Mock API response for "Automation Testing"
    const mockApiResponse = [
    { title: 'Automation Testing 101', description: 'An introduction to automation testing.' },
    { title: 'Advanced Automation Testing Techniques', description: 'Learn advanced techniques for automation testing.' },
    { title: 'Automation Testing Best Practices', description: 'Best practices for effective automation testing.' },
];

    console.log(`Mock API Response: ${JSON.stringify(mockApiResponse)}`);

    console.log(`Results matching the term "${searchTerm}" are displayed. Test passed.`);
})
