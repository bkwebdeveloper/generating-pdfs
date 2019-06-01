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
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf8');
    return hbs.compile(html)(data);
};

(async () => {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('resume', data);
        console.log(content)
        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4',
            printBackground: true
        });
        console.log('done');
        await browser.close();
    } catch (e) {
        console.log('Error', e);
    }
})();