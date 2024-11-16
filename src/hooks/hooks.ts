import { BeforeAll, AfterAll, Before, After, Status, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
const fs = require("fs-extra");

// Define CustomWorld class to hold shared variables
class CustomWorld {

    private attachments: Array<{ data: Buffer | string, mimeType: string }> = [];
    attach(data: Buffer | string, mimeType: string) {
        // Store the attachment in the array
        this.attachments.push({ data, mimeType });

        // Optionally log the attachment or handle it as needed
        console.log(`Attached data of type ${mimeType}`);
    }
    uiResults: Array<{ title: string; description: string }>;
    apiResults: Array<{ title: string; description: string }>;
    resultStatus: string; // Add this line to store the result status

    constructor() {
        this.uiResults = []; // Initialize uiResults here
        this.apiResults = []; // Initialize apiResults here if needed
        this.resultStatus = ''; // Initialize resultStatus
    }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);


let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});

// Add this step to maximize the window or set a larger viewport
const setViewportSize = async (page: Page) => {
    // Set viewport size to 1920x1080
    await page.setViewportSize({ width: 1920, height: 1080 });
};

// It will trigger for not auth scenarios
Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
    
    // Set the viewport size for the page
    await setViewportSize(fixture.page); // Maximize or set viewport
});

// It will trigger for auth scenarios
Before({ tags: '@auth' }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;
    context = await browser.newContext({
        storageState: getStorageState(pickle.name),
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
    
    // Set the viewport size for the page
    await setViewportSize(fixture.page); // Maximize or set viewport
});

After(async function (this: CustomWorld, { pickle, result }) {
    let videoPath: string | undefined;
    let img: Buffer | undefined;
    const path = `./test-results/trace/${pickle.id}.zip`;
    
    if (result?.status === Status.PASSED) {
        img = await fixture.page.screenshot({
            path: `./test-results/screenshots/${pickle.name}.png`, 
            type: "png"
        });
        const video = fixture.page.video();
        videoPath = video ? await video.path() : undefined;
    }
    
    //Cleanup: Clear cookies and local storage for the next scenario
    await fixture.page.context().clearCookies();
    await fixture.page.evaluate(() => localStorage.clear());

    // Stop tracing and close the page/context

    await context.tracing.stop({ path: path });
    await fixture.page.close();
    await context.close();
    
    if (result?.status === Status.PASSED) {
        if (img) {
            await this.attach(img, "image/png");
        }
        if (videoPath) {
            await this.attach(fs.readFileSync(videoPath), 'video/webm');
        } else {
            console.warn('Video path is undefined or null.');
        }
        
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
        await this.attach(traceFileLink, 'text/html'); // Attach the trace file link as a string
    }
});

AfterAll(async function () {
    await browser.close();
});

function getStorageState(user: string): string | undefined {
    if (user.endsWith("admin")) {
        return "src/helper/auth/admin.json";
    } else if (user.endsWith("lead")) {
        return "src/helper/auth/lead.json";
    }
    return undefined; // Ensure a return value
}
