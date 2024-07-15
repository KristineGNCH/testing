/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import puppeteer from 'puppeteer';
import { fork } from 'child_process';

describe('Card Form', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: true,
      // slowMo: 100,
      // devtools: false,
    });
    page = await browser.newPage();
  });

  jest.setTimeout(200000);
  test.each([
    ['.success-message', 'valid', '4627100101654724'],
    ['.error-message', 'invalid', '4627100101654'],
    ['.error-message', 'invalid', '4627'],
    ['.error-message', 'invalid', ''],
  ])('should add %s class if card number is %s', async (message, _, cardNumber) => {
    await page.goto('http://localhost:3010', { waitUntil: 'load' });
    await page.waitForSelector('#form');

    const form = await page.$('#form');
    const input = await form.$('.input');
    const button = await form.$('.button');

    await input.type(cardNumber);
    await button.click();

    await page.waitForSelector(message);
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
    server.kill();
  });
});
