const puppeteer = require('puppeteer');
const chai = require('chai');


(async () => {
    const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true, defaultViewport: null,  slowMo: 10, args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]});
    const page = await browser.newPage();
    let errorMessage;

    await page.goto('https://testcafe-demo-page.glitch.me/');

    page.on('dialog', async dialog => {
        errorMessage = dialog.message();
        await dialog.dismiss();
    });

    const sizeHandle = await page.$('.noUi-handle');
    const handlePosition = await sizeHandle.boundingBox();
    await page.mouse.move(handlePosition.x + handlePosition.width / 2, handlePosition.y + handlePosition.height / 2);
    await page.mouse.down();
    await page.mouse.move(handlePosition.x + 100, handlePosition.y);
    await page.mouse.up();
    
    await page.click('.next-step');
    await page.click('label[for="pepperoni"');
    await page.click('#step2 .next-step');

    await page.waitForSelector('.google-map', {visible: true});
    await page.click('.confirm-address');

    await page.focus('#phone-input');
    await page.keyboard.type('+1-541-754-300');
    await page.click('#step3 .next-step');
    chai.expect(errorMessage).to.equal("Please enter a valid phone number.");
    await page.focus('#phone-input');
    await page.keyboard.type('1');
    await page.click('#step3 .next-step');

    const frameHandle = await page.waitForSelector('.restaurant-location > iframe',  {timeout: 2000});
    const frame = await frameHandle.contentFrame();
    const zoomButton = await frame.waitForSelector('button[title="Zoom in"', {timeout: 2000});
    await frame.click('button[title="Zoom in"');
    await frame.click('button[title="Zoom in"');

    await page.click('.complete-order');

    await browser.close();
})();
