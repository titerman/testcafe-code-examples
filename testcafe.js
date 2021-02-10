import 'testcafe';
import { Selector } from 'testcafe';

fixture `Pizza Palace`
    .page `https://testcafe-demo-page.glitch.me/`;

test('My first test', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .drag('.noUi-handle', 100, 0)
        .click('.next-step')
        .click('label[for="pepperoni"]')
        .click('#step2 .next-step')
        .click('.confirm-address')
        .typeText('#phone-input', '+1-541-754-300')
        .click('#step3 .next-step');
    const alertMessage = await t.getNativeDialogHistory();
    await t.expect(alertMessage[0].text).eql('Please enter a valid phone number.')
        .typeText('#phone-input', '1')
        .click('#step3 .next-step');
    const restaurantLocation = Selector('.restaurant-location iframe');
    await t.switchToIframe(restaurantLocation);
    const zoomInButton = Selector ('#mapDiv').find('button[title="Zoom in"]');
    await t.click(zoomInButton)
        .click(zoomInButton)
        .switchToMainWindow()
        .click('.complete-order');
});
