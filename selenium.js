const {Builder, By, Key, until} = require('selenium-webdriver');

(async function pizzaPalace() {

    const driver = await new Builder().forBrowser('firefox').build();
    
    try {
        await driver.get('https://testcafe-demo-page.glitch.me/');

        // drag the pizza size slider
        const sourceEle = driver.findElement(By.className("noUi-handle"));
        const actions = driver.actions({async: true});
        await actions.dragAndDrop(sourceEle, {x:100, y:0}).perform();

        // select the toppings
        await driver.findElement(By.className("next-step")).click();
        await driver.findElement(By.css('label[for="pepperoni"]')).click(); 
        await driver.findElement(By.css('#step2 .next-step')).click();

        // fill the address form
        await driver.wait(until.elementLocated(By.css('.google-map')),10000);
        await driver.findElement(By.className("confirm-address")).click();   
        await driver.findElement(By.id('phone-input')).sendKeys('+1-541-754-3001');
        await driver.findElement(By.css('#step3 .next-step')).click();

        // zoom into the iframe map
        await driver.wait(until.elementLocated(By.css('.restaurant-location iframe')),10000);
        const restaurantLocationFrame = await driver.findElement(By.css('.restaurant-location iframe'));
        await driver.switchTo().frame(restaurantLocationFrame);
        await driver.wait(until.elementLocated(By.css('button[title="Zoom in"]')),10000);
        await driver.findElement(By.css('button[title="Zoom in"]')).click();

        // submit the order
        await driver.switchTo().defaultContent();
        await driver.findElement(By.className("complete-order")).click();

        // dismiss the confirmation dialog
        await driver.wait(until.alertIsPresent());
        const confirmationMessage = driver.switchTo().alert();
        await confirmationMessage.accept();
                
    } finally {
        await driver.quit();
    }
})();
