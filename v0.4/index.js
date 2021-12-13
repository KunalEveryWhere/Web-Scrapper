const puppeteer = require('puppeteer');
const fs = require("fs")
const json2csv = require("json2csv").Parser;

// Edit the values here
let URL = "https://money.udn.com/money/story/5612/5656266";
let Opening = "全家財報出爐，疫情衝擊來客人流";
let Closing = "業績向上。";
let fileName = "new";

// Core Logic
(async () => {
    //let linksData = [];
    let textData = [];

    const browser = await puppeteer.launch({
        headless: true
    });
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

    await browser.close();

    //From all extratcted text, substring only the ones we need -> from Opening Text until Closing Text
    newextractedText = extractedText.substring((extractedText.indexOf(Opening)), ((extractedText.lastIndexOf(Closing))+Closing.length-1));


    console.log(newextractedText);

    //Cleaning Data a bit
    let string = extractedText.toString();
    string.replace(/\r?\n|\r/g, "");

    //Extracting all words
    var splittedStr = [...string];
    var arrayLength = splittedStr.length;
    var words = [];
    var englishWord = "";
    var i;
    for (i = 0; i < arrayLength; i += 1) {
    if (/^[a-zA-Z]+$/.test(splittedStr[i])) {
        englishWord += splittedStr[i];
    } else if (/(\s)+$/.test(splittedStr[i])) {
        if (englishWord !== "") {
            words.push(englishWord);
            englishWord = "";
        }
    } else {
        if (englishWord !== "") {
            words.push(englishWord);
            englishWord = "";
        }
        words.push(splittedStr[i]);        
    }
}

if (englishWord !== "") {
    words.push(englishWord);
}




//Mapping each word from the array into a JSON of the same
   words.forEach(element => {
        textData.push({
            element: element
        })
    })

    
    //Parse to CSV
    const CSVparser = new json2csv();
    const csv = CSVparser.parse(textData);

    //Write to file system
    fs.writeFileSync(("./final export/"+fileName+".csv"), csv, "utf-8");
})();