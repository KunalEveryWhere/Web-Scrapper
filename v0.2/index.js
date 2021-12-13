const axios = require('axios');
const { convert } = require('html-to-text');
const fs = require("fs")
const json2csv = require("json2csv").Parser;

let URL = "https://money.udn.com/money/story/5612/5656266";

(async () => {
    let linksData = [];
    let textData = [];

    const response = await axios.get(URL);
    const text = convert(response.data);

    console.log(text);

    let arr = JSON.stringify(text).split(' ');

    arr.forEach(element => {
        textData.push({
            element: element
        })
    })

    const CSVparser = new json2csv();
    const csv = CSVparser.parse(textData);

    fs.writeFileSync("./words.csv", csv, "utf-8");

})();