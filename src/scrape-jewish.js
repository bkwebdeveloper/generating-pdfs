const puppeteer = require('puppeteer');

let bookingUrl = 'https://jewishphilly.org/need-help/resource-category/religious-life/synagogues/';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.resources__section-entries');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {

                hotelJson.name = hotelelement.querySelector('article.sentry-row resources__row').innerText;
                hotelJson.reviews = hotelelement.querySelector('div.bui-review-score__text').innerText;
                hotelJson.rating = hotelelement.querySelector('div.bui-review-score__badge').innerText;
                if(hotelelement.querySelector('div.bui-price-display__value')){
                    // console.log(hotelelement.querySelector('div.bui-price-display__value prco-inline-block-maker-helper').innerText);
                    hotelJson.price = hotelelement.querySelector('div.bui-price-display__value').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();