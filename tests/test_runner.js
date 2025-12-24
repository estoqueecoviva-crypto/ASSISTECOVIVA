const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  const filePath = path.resolve(__dirname, 'test_style.html');
  await page.goto(`file://${filePath}`);

  await page.evaluate(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
      const heroTitle = document.querySelector('.hero h1');
      const heroTitleSize = getComputedStyle(heroTitle).fontSize;
      console.assert(heroTitleSize === '28px', 'Test 7 Failed: Hero title font size should be smaller on smaller screens');
    }
  });

  await browser.close();
})();
