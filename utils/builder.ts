import { Builder, ThenableWebDriver, WebDriver } from "selenium-webdriver";
import { Options as chromeOptions } from "selenium-webdriver/chrome";
import { Options as firefoxOptions } from "selenium-webdriver/firefox";
const edge = require('selenium-webdriver/edge');

const mobileWidth: number = 720;
const desktopWidth: number = 1440;

// Address of a grid router, port 4444 by default for localhost or LAN
const gridRouterAddress: string = "https://whatever.whenever";

// If browsers (not WebDrivers) are installed to non-default location
// Examples for MacOS, change /Path/To/Applications/ to wherever Chrome, Edge or Firefox are installed
const chromeBinariesPath: string = "/Path/To/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";  // Change this if you want to use it
const edgeBinariesPath: string = "/Path/To/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";  // Change this if you want to use it
const firefoxBinariesPath: string = "/Path/To/Applications/Firefox.app/Contents/MacOS/firefox";             // Change this if you want to use it
// Safari can't be installed anywhere else but where it always is, i.e. Safari is special, as usual

/**
 * Sets WebDriver options and creates WebDriver instance
 * @param browserDriver string representing which WebDriver it should create (currently available: chrome, firefox, MicrosoftEdge, safari)
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns WebDriver instance or throws error if creating new instance fails
 */
export function GetDriver(
    browserDriver: string, 
    size: string = "", 
    UI: string = process.env.UI, 
    binaries: string = process.env.BINARIES,
    location: string = process.env.LOCATION
): WebDriver{
    try{
        switch(browserDriver){
            case "MicrosoftEdge":
                return BuildEdgeDriver(size, UI, binaries, location);
            case "chrome":
                return BuildChromeDriver(size, UI, binaries, location);
            case "safari":
                return BuildSafariDriver(size,
                    // location
                    );
            case "firefox":
                return BuildFirefoxDriver(size, UI, binaries, location);
            default:
                throw new Error(`WebDriver "${browserDriver}" not implemented.`);
        };
    }
    catch(e){
        throw e;
    };
};

/**
 * Sets Safari WebDriver size and build it. Its binaries and headlessness can't be set so it's always default and with GUI
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns built Safari WebDriver instance
 */
function BuildSafariDriver(
    size: string,
    // location: string
): WebDriver{
    let safariDriver: WebDriver;

    // if (location === "remote")
    //     safariDriver = new Builder()
    //         .forBrowser("safari")
    //         .usingServer(gridRouterAddress)
    //         .build();
    // else
        safariDriver = new Builder()
            .forBrowser("safari")
            .build();

    if(size === "mobile")
        safariDriver.manage().window().setRect({width: mobileWidth, height: 960});
    else if(size === "desktop")
        safariDriver.manage().window().setRect({width: desktopWidth, height: 960});
    
    return safariDriver;
};

/**
 * Sets Chrome WebDriver options and builds it
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns built Chrome WebDriver instance
 */
function BuildChromeDriver(size: string, UI: string, binaries: string, location: string): ThenableWebDriver{
    const chromeSettings = new chromeOptions();

    if(UI === "headless")
        chromeSettings.headless();

    if(binaries === "custom")
        chromeSettings.setChromeBinaryPath(chromeBinariesPath);

    if(size === "mobile")
        chromeSettings.windowSize({width: mobileWidth, height: 960});
    else if(size === "desktop")
        chromeSettings.windowSize({width: desktopWidth, height: 960});

    if (location === "remote")
        return new Builder()
            .forBrowser("chrome")
            .setChromeOptions(chromeSettings)
            .usingServer(gridRouterAddress)
            .build();
    else
        return new Builder()
            .forBrowser("chrome")
            .setChromeOptions(chromeSettings)
            .build();
};

/**
 * Sets Microsoft Edge WebDriver options and builds it
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns built Microsoft Edge WebDriver instance
 */
function BuildEdgeDriver(size: string, UI: string, binaries: string, location: string): ThenableWebDriver{
    const edgeSettings = new edge.Options();
    // MSEdge on Windows10 needs this
    // edgeSettings.setEdgeChromium(true);

    if(UI === "headless")
        edgeSettings.headless();
    
    if(binaries === "custom")
        edgeSettings.setBinaryPath(edgeBinariesPath);

    if(size === "mobile")
        edgeSettings.windowSize({width: mobileWidth, height: 960});
    else if(size === "desktop")
        edgeSettings.windowSize({width: desktopWidth, height: 960});

    if(location === "remote")
        return new Builder()
            .forBrowser("MicrosoftEdge")
            .setEdgeOptions(edgeSettings)
            .usingServer(gridRouterAddress)
            .build();
    else
        return new Builder()
            .forBrowser("MicrosoftEdge")
            .setEdgeOptions(edgeSettings)
            .build();
};

/**
 * Sets Firefox WebDriver options and builds it
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns built Firefox WebDriver instance
 */
function BuildFirefoxDriver(size: string, UI: string, binaries: string, location: string): WebDriver{
    const firefoxSettings: firefoxOptions = SetFirefoxSettings(size, UI, binaries);
    let firefoxDriver: WebDriver;

    if (location === "remote")
        firefoxDriver = new Builder()
            .forBrowser("firefox")
            .setFirefoxOptions(firefoxSettings)
            .usingServer(gridRouterAddress)
            .build();
    else
        firefoxDriver = new Builder()
            .forBrowser("firefox")
            .setFirefoxOptions(firefoxSettings)
            .build();

    if(UI !== "headless" && size === "mobile")
        firefoxDriver.manage().window().setRect({width: mobileWidth, height: 960});
    else if(UI !== "headless" && size === "desktop")
        firefoxDriver.manage().window().setRect({width: desktopWidth, height: 960});

    return firefoxDriver;
};

/**
 * Sets Firefox WebDriver options
 * @param size empty as default, "desktop" for desktopWidth width, "mobile" for mobileWidth
 * @returns set Firefox webdriver options
 */
function SetFirefoxSettings(size: string, UI: string, binaries: string): firefoxOptions{
    let firefoxSettings: firefoxOptions;

    if(binaries === "custom"){
        if(UI === "headless"){
            if(size === "mobile"){
                // custom binaries & headless mode & mobile size
                firefoxSettings = new firefoxOptions()
                    .setBinary(firefoxBinariesPath)
                    .windowSize({width: mobileWidth, height: 960})
                    .headless();
            }
            else if(size === "desktop"){
                // custom binaries & headless mode & desktop size
                firefoxSettings = new firefoxOptions()
                    .setBinary(firefoxBinariesPath)
                    .windowSize({width: desktopWidth, height: 960})
                    .headless();
            }
            else{
                // custom binaries & headless mode & default size
                firefoxSettings = new firefoxOptions()
                    .setBinary(firefoxBinariesPath)
                    .headless();
            };

        }
        else{
            // custom binaries & GUI mode
            firefoxSettings = new firefoxOptions()
                .setBinary(firefoxBinariesPath)
        };
    }
    else{
        if(UI === "headless"){
            if(size === "mobile"){
                // default binaries & headless mode & mobile size
                firefoxSettings = new firefoxOptions()
                    .windowSize({width: mobileWidth, height: 960})
                    .headless();
            }else if(size === "desktop"){
                // default binaries & headless mode & desktop size
                firefoxSettings = new firefoxOptions()
                    .windowSize({width: desktopWidth, height: 960})
                    .headless();
            }else{
                // default binaries & headless mode & default size
                firefoxSettings = new firefoxOptions()
                    .headless();
            };
        }
        else{
            // default binaries & GUI mode
            firefoxSettings = new firefoxOptions();
        };
    };

    return firefoxSettings;
};
