import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/email.html', { 
    waitUntil: 'networkidle2' 
  });
  
  // Wait additional 2 seconds as requested
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'email-page-screenshot.png', 
    fullPage: true 
  });
  
  // Get detailed page information
  const pageInfo = await page.evaluate(() => {
    const emailPage = document.querySelector('.email-page');
    const title = document.querySelector('.email-title');
    const input = document.querySelector('.kosmo-input');
    const doodle = document.querySelector('.email-doodle');
    const container = document.querySelector('[data-barba-namespace="email"]');
    
    const getComputedStyles = (el, props) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      const result = {};
      props.forEach(prop => {
        result[prop] = computed.getPropertyValue(prop);
      });
      return result;
    };
    
    return {
      containerBg: getComputedStyles(container, ['background-color', 'background']),
      title: {
        exists: !!title,
        text: title?.textContent,
        styles: getComputedStyles(title, ['font-family', 'font-size', 'font-weight', 'color']),
        rect: title?.getBoundingClientRect()
      },
      input: {
        exists: !!input,
        styles: getComputedStyles(input, ['width', 'max-width']),
        rect: input?.getBoundingClientRect()
      },
      doodle: {
        exists: !!doodle,
        src: doodle?.src,
        styles: getComputedStyles(doodle, ['width', 'height', 'position', 'right', 'bottom']),
        rect: doodle?.getBoundingClientRect()
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      body: getComputedStyles(document.body, ['background-color'])
    };
  });
  
  console.log(JSON.stringify(pageInfo, null, 2));
  
  await browser.close();
})();
