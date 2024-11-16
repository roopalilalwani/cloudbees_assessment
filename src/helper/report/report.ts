const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "test-results",
    reportPath: "test-results/reports/",
    reportName: "Playwright JS Automation Report",
    pageTitle: "CloudBees Inc - Udacity Catalog test report",
    displayDuration: false,
    metadata: {
        browser: {
            name: "chrome",
            version: "130",
        },
        device: "Mano - PC",
        platform: {
            name: "Windows",
            version: "10",
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: "Udacity" },
            { label: "Release", value: "1.1.1" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});