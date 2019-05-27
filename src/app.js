const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');
const data = require('./database.json');

hbs.registerHelper('dateFormat', function(value, format) {
    // console.log('formatting', value, format);
    return moment(value).format(format);
});

const compile = async function(templateName, data){
    console.log('working2');

    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    console.log('working3');

    const html = await fs.readFile(filePath, 'utf-8');
    console.log('working4');

    return hbs.compile(html)(data);
};

(async function() {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log('working1');

        const content = await compile('resume', data);
        console.log('working5');

        await page.setContent('<h1>content</h1>');
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4',
            printBackground: true
        });
        console.log('working6');

        console.log('done');
        await browser.close();
        process.exit();
    } catch (e) {
        console.log('Error', e);
    }
}());