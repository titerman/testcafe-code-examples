const {Builder, By, Key, until} = require('selenium-webdriver');
const chai = require('chai');
const chaiWebdriver = require('chai-webdriver');

(async function pizzaPalace() {
    const driver = await new Builder().forBrowser('firefox').build();
    chai.use(chaiWebdriver(driver));
    
    try {
        await driver.get('https://testcafe-demo-page.glitch.me/'); // load the page

        const sourceEle = driver.findElement(By.className("noUi-handle")); // find the slider
        const actions = driver.actions({async: true});
        await actions.dragAndDrop(sourceEle, {x:100, y:0}).perform(); // move the slider


        await driver.findElement(By.className("next-step")).click();
        await driver.findElement(By.css('label[for="pepperoni"]')).click(); 
        await driver.findElement(By.css('#step2 .next-step')).click();

        await driver.wait(until.elementLocated(By.css('.google-map')),10000); // wait for the first map to load before requesting data
        await driver.findElement(By.className("confirm-address")).click();   
        await driver.findElement(By.id('phone-input')).sendKeys('+1-541-754-300');
        await driver.findElement(By.css('#step3 .next-step')).click();

        await driver.wait(until.alertIsPresent());  // wait for the alert
        const errorMessage = driver.switchTo().alert(); // switch to the alert
        const errorContent = await errorMessage.getText(); // process the alert
        await errorMessage.accept();
        chai.expect(errorContent).to.equal("Please enter a valid phone number.");

        await driver.findElement(By.id('phone-input')).sendKeys('1');
        await driver.findElement(By.css('#step3 .next-step')).click();

        await driver.wait(until.elementLocated(By.css('.restaurant-location iframe')),10000); // wait for the iframe to appear
        const restaurantLocationFrame = await driver.findElement(By.css('.restaurant-location iframe')); // select the iframe
        await driver.switchTo().frame(restaurantLocationFrame); // switch to the iframe
        await driver.wait(until.elementLocated(By.css('button[title="Zoom in"]')),10000); // wait for the button to appear
        await driver.findElement(By.css('button[title="Zoom in"]')).click(); // click the button
        await driver.findElement(By.css('button[title="Zoom in"]')).click();

        await driver.switchTo().defaultContent();
        await driver.findElement(By.className("complete-order")).click();
    } finally {
        await driver.quit();
    }
})();
