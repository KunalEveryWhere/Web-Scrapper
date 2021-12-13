const puppeteer = require('puppeteer');
const fs = require("fs")
const json2csv = require("json2csv").Parser;

let URL = "https://money.udn.com/money/story/5612/5656266";

(async () => {
    let linksData = [];
    let textData = [];

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = (await browser.pages())[0];
    await page.goto(URL);
    const extractedText = await page.$eval('*', (el) => el.innerText);

    
    //let arr = JSON.stringify(extractedText).split(/，| /);
    let str = JSON.stringify(extractedText);
    //let str2 = str.replace(/\n/g,' ');


    let arr = JSON.stringify(extractedText).split(/，| /);


    arr.forEach(element => {
        textData.push({
            element: element
        })
    })

    await browser.close();

    const CSVparser = new json2csv();
    const csv = CSVparser.parse(textData);

    fs.writeFileSync("./words.csv", csv, "utf-8");
})();

