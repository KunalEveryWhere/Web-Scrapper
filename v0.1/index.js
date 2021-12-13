const req = require("request-promise");
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

//let URL = "https://news.cnyes.com/news/id/4762226";
let URL = "https://money.udn.com/money/story/5612/5656266";

(async() => {
    let linksData = [];
    let textData = [];

    const res = await req({
        uri: URL,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-IN,en;q=0.9,nl-IN;q=0.8,nl;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        },
        gzip: true
    });

    let $ = cheerio.load(res);
    /*let tempOne = $('h1[itemprop="headline"]').text();*/
    //console.log(tempOne);

    let tempOne = $('html').text();

    let arr = JSON.stringify(tempOne).split(' ');
    //let arr = JSON.stringify(tempOne).split(/,| |\n/);
    console.log(arr[7]);

    /*textData.push({
        title: tempOne
    });*/

    arr.forEach(element => {
        textData.push({
            element: element
        })
    })



    const CSVparser = new json2csv();
    const csv = CSVparser.parse(textData);

    fs.writeFileSync("./titles.csv", csv, "utf-8");

}
)();