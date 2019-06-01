const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
    try{
        const browser = await puppeteer.launch({ headless: false});
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3800.0 Safari/537.36 Edg/76.0.172.0');

        await page.goto('https://experts.shopify.com/');
        await page.waitForSelector('.section');
        const sections = await page.$$('.section');
        // console.log(`${sections.length}`);
        
        await fs.writeFile('out.csv', 'section, name');

        for(let i = 0; i < sections.length; i++) {
            await page.goto('https://experts.shopify.com/');
            await page.waitForSelector('.section');
            const sections = await page.$$('.section');

            const section = sections[i];
            const button = await section.$('a.marketing-button');
            const buttonName = await page.evaluate(button => button.innerHTML, button);
            console.log(buttonName)
            button.click();

            await page.waitForSelector('#ExpertsResults');
            const lis = await page.$$('#ExpertsResults > li');

            for(const li of lis){
                const name = await li.$eval('h2', h2 => h2.innerText);
                console.log('name', name);
                await fs.appendFile('out.csv', `"${buttonName}", "${name}"\n`);
            }
        }
    } catch (e) {
        console.log('our error: ', e);
    }
})();