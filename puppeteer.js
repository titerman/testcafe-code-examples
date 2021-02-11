const puppeteer = require('puppeteer');

(async () => {

    // launch Chrome with the selected parameters
    const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true, defaultViewport: null,  slowMo: 10, args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]});

    // open the specified URL in a new tab
    const page = await browser.newPage();
    await page.goto('https://testcafe-demo-page.glitch.me/');

    // automatically dismiss dialog boxes
    page.on('dialog', async dialog => {
        await dialog.dismiss();
    });

    // drag the pizza size slider
    const sizeHandle = await page.$('.noUi-handle');
    const handlePosition = await sizeHandle.boundingBox();
    await page.mouse.move(handlePosition.x + handlePosition.width / 2, handlePosition.y + handlePosition.height / 2);
    await page.mouse.down();
    await page.mouse.move(handlePosition.x + 100, handlePosition.y);
    await page.mouse.up();

    // select the toppings
    await page.click('.next-step');
    await page.click('label[for="pepperoni"');
    await page.click('#step2 .next-step');

    // fill the address form
    await page.waitForSelector('.google-map', {visible: true});
    await page.click('.confirm-address');
    await page.focus('#phone-input');
    await page.keyboard.type('+1-541-754-3001');
    await page.click('#step3 .next-step');


    // zoom into the iframe map
    const frameHandle = await page.waitForSelector('.restaurant-location > iframe',  {timeout: 2000});
    const frame = await frameHandle.contentFrame();
    const zoomButton = await frame.waitForSelector('button[title="Zoom in"', {timeout: 2000});

    // submit the order
    await frame.click('button[title="Zoom in"');
    await page.click('.complete-order');
    await browser.close();
})();
