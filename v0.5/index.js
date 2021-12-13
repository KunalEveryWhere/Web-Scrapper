const puppeteer = require('puppeteer');
const fs = require("fs");
const json2csv = require("json2csv").Parser;

// Edit the values here
let URL = "https://money.udn.com/money/story/5612/5656266";
let Opening = "全家財報出爐，疫情衝擊來客人流";
let Closing = "業績向上。";
let fileName = "全家財";

// Core Logic
(async () => {
    let textData = [];

    //Asycnonous Headless Browsing
    const browser = await puppeteer.launch({
        headless: true
    });

    console.log("Session Started...\nTo cancel, use 'Ctrl + C'\n\n\n");

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(URL);
    const extractedText = await page.$eval('*', (el) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(el);
        selection.removeAllRanges();
        selection.addRange(range);
        return window.getSelection().toString();
    });

    //Closes Browser Session
    await browser.close();
    
    //From all extratcted text, substring only the ones we need -> from Opening Text until Closing Text
    console.log("Extracting Data...")
    let newextractedText = extractedText.substring((extractedText.indexOf(Opening)), ((extractedText.lastIndexOf(Closing))+Closing.length-1));

    //Parse to CSV
    console.log("Parsing and converting to CSV")
    const CSVParser = new json2csv();
    textData.push({1: newextractedText});
    const csv = CSVParser.parse(textData);


    //Write to file system
    fs.writeFileSync(("./final export/"+fileName+".csv"), csv, "utf-8");
    console.log("Sucessfully Exported\n\tFile:\t"+fileName+".csv");

})();