# technical_assesment_cloudbees
# Playwright Cucumber Testing Framework

# Overview
This project implements a testing framework using Playwright and Cucumber for automated UI testing of the Udacity catalog. The framework supports search functionality and validates results against a mocked API response.

# Features
1. Automated navigation to the Udacity catalog.
2. Search functionality for specific terms.
3. UI results validation against mocked API responses.
4. Cucumber integration for behavior-driven development (BDD).

# Requirements
Node.js (v14 or higher)
npm (Node Package Manager)
TypeScript
Playwright
Cucumber
Chai (for assertions)
Installation

### Setup:

1. Clone or download the project: git clone <repository-url>
2. Extract and open in the VS-Code
3. `npm install` to install the dependencies
4. `npx playwright install` to install the browsers
5. `npm run test` to execute the tests
6. To run a particular test change  
```
  paths: [
            "src/test/features/featurename.feature"
         ] 
```