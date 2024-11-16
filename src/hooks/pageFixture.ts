import { Page } from "@playwright/test";
import { Logger, createLogger, transports } from "winston";

export const fixture = {
    page: {} as Page,  // Initialize with a placeholder 
    logger: createLogger({
        transports: [
            new transports.Console() // Example, adjust based on your logging needs
        ]
    }) as Logger
};
