import * as express from "express";
const puppeteer = require("puppeteer");
const fs = require('fs');
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {


    //pulls list of STONKS from text file into an array
    let list = [];
    list = fs.readFileSync('stonks.txt').toString().split("\r\n");


    let indexes = 0;
    let currentTag = 0;
    //launches a new browser window
    let i = 0;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
    });

    const page = await browser.newPage(); //creates new page
    await page.goto("https://finance.yahoo.com/quote/" + list[currentTag] + "/history?p=" + list[currentTag], {
      waitUntil: "domcontentloaded"
    });

    //clicks the date and sets it to a full year.
    await page.$eval("#Col1-1-HistoricalDataTable-Proxy > section > div.Pt\\(15px\\) > div.Bgc\\(\\$lv1BgColor\\).Bdrs\\(3px\\).P\\(10px\\) > div:nth-child(1) > div > div > div");
    await page.$eval("#dropdown-menu > div > ul:nth-child(2) > li:nth-child(2) > button > span");
    await page.$eval("#Col1-1-HistoricalDataTable-Proxy > section > div.Pt\\(15px\\) > div.Bgc\\(\\$lv1BgColor\\).Bdrs\\(3px\\).P\\(10px\\) > button > span").click();

    //sets up place to store entries
    let data: any = {
      tag: [],
      date: [],
      closePrice: [],
      highPrice: [],
    };

    while (indexes < list.length) {
      //scrolls to bottom of page for loading purposes
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });



      let dataTemp: any = {
        currentPrice: "",
        date: "",
        closePrice: "",
        highPrice: "",
      };


      //loops through items, gets the date and all closing prices.
      let date = await page.$$eval(
        "#Col1-1-HistoricalDataTable-Proxy > section > div.Pb\\(10px\\).Ovx\\(a\\).W\\(100\\%\\) > table > tbody > tr > td.Py\\(10px\\).Ta\\(start\\).Pend\\(10px\\) > span",
        (el: { map: (arg0: (i: any) => any) => void }) =>
          el.map((i: { innerText: any }) => i.innerText)
      );

      let prices = await page.$$eval("#Col1-1-HistoricalDataTable-Proxy > section > div.Pb\\(10px\\).Ovx\\(a\\).W\\(100\\%\\) > table > tbody > tr > td:nth-child(5) > span", (el: { map: (arg0: (i: any) => any) => void }) =>
        el.map((i: { innerText: any }) => i.innerText)
      );

      console.log(date)
      let currentPlace = 0;
      //cycle through dates to find doubles and remove entries
      while (currentPlace < date.length) {
        if (date[currentPlace] == date[currentPlace + 1]) {
          date.splice(currentPlace + 1, 1);
          prices.splice(currentPlace + 1, 1);
        }

        currentPlace++;
      }
      console.log(currentPlace + " CP")
      //cycle through prices to find current and lowest and highest prices with their date
      //by comparing current price to all previous prices

      //IS CURRENT PRICE ALSO THE LOWEST IT'S BEEN?
      let currentPlaceLow = 0;
      dataTemp.currentPrice = prices[0];
      while (currentPlaceLow < prices.length) {
        if (parseInt(prices[0]) <= (parseInt(prices[currentPlaceLow]))) {
          currentPlaceLow++;
        } else {
          currentPlaceLow = 9999;
        }
      }

      if (currentPlaceLow < 9999) {
        dataTemp.closePrice = prices[currentPlaceLow];
        //IF SO, IT'S A WINNER SO ALSO FIND THE HIGHEST PRICE
        let currentPlaceHigh = 0;
        while (currentPlaceHigh < prices.length) {
          if (parseInt(prices[currentPlaceHigh]) > (parseInt(prices[currentPlaceHigh + 1]))) {
            dataTemp.highPrice = prices[currentPlaceHigh];
          }
          currentPlaceHigh++;
        }


        console.log("DATEA")
        //if current price is lowest, Send TAG and all data
        data.tag.push(list[currentTag]);
        data.date.push(date[prices.indexOf(dataTemp.highPrice)]);
        data.closePrice.push(dataTemp.closePrice);
        data.highPrice.push(dataTemp.highPrice);
      }

      currentTag++;

      await page.goto("https://finance.yahoo.com/quote/" + list[currentTag] + "/history?p=" + list[currentTag], {
        waitUntil: "domcontentloaded"
      });
      indexes++;

    }



    //closes page; change page to 'browser' if you want it to close browser when done
    browser.close();

    console.log(data)
    res.send(JSON.stringify(data));
  } catch (e) {
    throw e;
  }
});

export default router;