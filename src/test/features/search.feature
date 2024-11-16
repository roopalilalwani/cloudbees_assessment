Feature: UI and API validation using Playwright with TypeScript
Scenario: Validate Search Functionality
Given User navigates to the application
And user search for "Testing"
And user clicks on "Skill" Dropdown
When user search for "Automation testing" in Skill Dropdown
Then user sees results matching the search term in the UI
And user fetch search results from the API
Then the UI results should match the API results

Scenario: Invalid Search with No Results 
Given the application is loaded successfully 
When user search for "NonExistentTerm" 
Then user should see a "No results found" message
