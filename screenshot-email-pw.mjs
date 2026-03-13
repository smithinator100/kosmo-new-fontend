import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173/email.html', { 
    waitUntil: 'networkidle' 
  });
  
  // Wait additional 2 seconds as requested
  await page.waitForTimeout(2000);
  
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
    const inputField = document.querySelector('.kosmo-input-field');
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
    
    const getRect = (el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      };
    };
    
    return {
      containerBg: getComputedStyles(container, ['background-color', 'background', 'padding']),
      emailPage: {
        exists: !!emailPage,
        styles: getComputedStyles(emailPage, ['padding', 'gap', 'display', 'flex-direction']),
        rect: getRect(emailPage)
      },
      title: {
        exists: !!title,
        text: title?.textContent,
        visible: title ? (title.offsetWidth > 0 && title.offsetHeight > 0) : false,
        styles: getComputedStyles(title, ['font-family', 'font-size', 'font-weight', 'color']),
        rect: getRect(title)
      },
      input: {
        exists: !!input,
        visible: input ? (input.offsetWidth > 0 && input.offsetHeight > 0) : false,
        styles: getComputedStyles(input, ['width', 'max-width', 'position']),
        rect: getRect(input)
      },
      inputField: {
        exists: !!inputField,
        visible: inputField ? (inputField.offsetWidth > 0 && inputField.offsetHeight > 0) : false,
        rect: getRect(inputField)
      },
      doodle: {
        exists: !!doodle,
        visible: doodle ? (doodle.offsetWidth > 0 && doodle.offsetHeight > 0) : false,
        src: doodle?.src,
        alt: doodle?.alt,
        styles: getComputedStyles(doodle, ['width', 'height', 'position', 'right', 'bottom', 'pointer-events']),
        rect: getRect(doodle),
        naturalSize: doodle ? { width: doodle.naturalWidth, height: doodle.naturalHeight } : null
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight
      },
      body: getComputedStyles(document.body, ['background-color', 'margin', 'padding'])
    };
  });
  
  console.log(JSON.stringify(pageInfo, null, 2));
  
  await browser.close();
})();
