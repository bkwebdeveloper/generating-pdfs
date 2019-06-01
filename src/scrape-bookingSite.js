const puppeteer = require('puppeteer');

let bookingUrl = 'https://www.booking.com/searchresults.en-us.html?label=gen173nr-1FCAEoggI46AdIM1gEaGyIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4AsXOuecFwAIB&sid=180c284fc5fa26fcd0bab15c8502251b&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaGyIAQGYATG4ARfIAQzYAQHoAQH4AQKIAgGoAgO4AsXOuecFwAIB%3Bsid%3D180c284fc5fa26fcd0bab15c8502251b%3Bsb_price_type%3Dtotal%26%3B&ss=Singapore%2C+Singapore&is_ski_area=&checkin_year=2019&checkin_month=5&checkin_monthday=30&checkout_year=2019&checkout_month=5&checkout_monthday=31&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=sing&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=-73635&dest_type=city&iata=SIN&place_id_lat=1.29045&place_id_lon=103.85204&search_pageview_id=efa44de2cfcf00d5&search_selected=true&search_pageview_id=efa44de2cfcf00d5&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0';
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('div.bui-review-score__text').innerText;
                hotelJson.rating = hotelelement.querySelector('div.bui-review-score__badge').innerText;
                
                if(hotelelement.querySelector('div.bui-price-display__value') || hotelelement.querySelector('span.only_x_left').innerHTML){
                    // console.log(hotelelement.querySelector('div.bui-price-display__value prco-inline-block-maker-helper').innerText);
                    hotelJson.price = hotelelement.querySelector('div.bui-price-display__value').innerText;
                    let roomsLeft = hotelelement.querySelector('span.only_x_left').innerHTML;
                    hotelJson.roomsLeft = roomsLeft.replace(/\r?\n|\r/g, "").match(/\d+/)[0];
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