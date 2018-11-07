'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const testing = require('selenium-webdriver/testing');

const describe = testing.describe;
const context = testing.describe;
const it = testing.it;
const before = testing.before;
const after = testing.after;

const createServerController = require('./server.js');

const TIMEOUT_MSEC = 60 * 1000;
const PORT = 9999;
const HOSTNAME = 'localhost';
const BASE_URL = `http://${HOSTNAME}:${PORT}`;


describe('Tweakpane', function() {
  this.timeout(TIMEOUT_MSEC);

  let driver;
  let serverController;


  before(() => {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

    serverController = createServerController(9999, 'localhost');
    return serverController.waitForStart();
  });


  context('when using global', () => {
    it('should be able to display a monitor', () => {
      driver.get(`${BASE_URL}/import_via_global.html`);

      return driver.wait(until.elementLocated(By.tagName('canvas')), 10000);
    });
  });


  context('when using commonjs', () => {
    it('should be able to display a monitor', () => {
      driver.get(`${BASE_URL}/import_via_commonjs.html`);

      return driver.wait(until.elementLocated(By.tagName('canvas')), 10000);
    });
  });


  context('when using amd', () => {
    it('should be able to display a monitor', () => {
      driver.get(`${BASE_URL}/import_via_amd.html`);

      return driver.wait(until.elementLocated(By.tagName('canvas')), 10000);
    });
  });


  after(() => {
    serverController.stop();
    return driver.quit();
  });
});
