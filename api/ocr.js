import puppeteer from 'puppeteer-core';
import { ocrSpace } from 'ocr-space-api-wrapper';

const IMG_URL = './img.jpg';
const pricePatterns = [
  /(?:\£|\$|\€)(\d+(?:,\d{1,2})?)/,
  /(\d+(?:,\d{1,2})?)\s?(?:USD|EUR|GBP)/, 
  /(\d+(?:,\d{1,2})?)\s?(?:USD|EUR|GBP)/, 
  /(\d+(?:,\d{1,2})?)\s?(?:USD|EUR|GBP)/, 
  /(?:\£|\$|\€)\s?(\d+(?:[.,]\d{1,2})?)/, 
  /(\d+(?:[.,]\d{1,2})?)\s?(?:USD|EUR|GBP)/, 
  /(\d+(?:[.,]\d{1,2})?)\s?(?:USD|EUR|GBP)/, 
  /(\d+(?:[.,]\d{1,2})?)\s?(?:USD|EUR|GBP)/,
  /(\d+(?:,\d{1,2})?)\s?,-/
];

async function inspectImageAndGetPrice() {
  try {
    const res1 = await ocrSpace(IMG_URL);
    if(!res1 || !res1.ParsedResults) return '';
    const text = res1.ParsedResults[0].ParsedText;
    return extractPrice(text, pricePatterns);
  } catch (error) {
    console.error(error);
  }
}

function extractPrice(text, pricePatterns) {
  for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
          return match[0].replace(' ', '');
      }
  }
  return null;
}

export async function openURLmakeScreenshot(url) {
  const browser = await puppeteer.launch({
    //executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36')
    await page.goto(url, { waitUntil: ['load', 'domcontentloaded', 'networkidle0'] });

    await page.addStyleTag({
      content: `
        * {
          font-family: Arial, sans-serif !important;
          font-size: 15px !important;
        }
      `
    });

    const productImageUrl = await getImageUrl(page);

    await clickPopup(page);
    await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 1000); // Wait for 1000 milliseconds (1 second)
      });
    });
    await clickPopup(page);

    await page.setViewport({ width: 1920, height: 1080 });

    const takenImage = await page.screenshot({ path: IMG_URL });
    const priceString = await inspectImageAndGetPrice(takenImage);
    const productName = getProductName(url)

    return {
      url, 
      name: productName, 
      priceString, 
      imageUrl: productImageUrl
    }
  } catch (error) {
    console.error(error);
    return '';
  } finally {
    await browser.close();
  }
}

// click potential popups like cookies etc.
async function clickPopup(page){
  await page.evaluate(_ => {
    const selector = 'a[id*=cookie i], a[class*=cookie i], button[id*=cookie i] , button[class*=cookie i], button';
    const expectedText = /^(Accept|Accept all cookies|Accept all|Allow|Allow all|Allow all cookies|OK|Accepteer|Accepteren|Toestaan|Alles Toestaan|Alles accepteren|Doorgaan|Alle cookies accepteren)$/gi;
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        if (element.textContent.trim().match(expectedText)) {
            element.click();
            return true;
        }
    }
  });
}

async function getImageUrl(page){
  // get product image
  const firstImageAboveThreshold = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    for (const image of images) {
      const { height } = image.getBoundingClientRect();
      if (height >= 300) {
        return image.src;
      }
    }
    return null;
  });

  return firstImageAboveThreshold;
} 

function getProductName(url) {
  // Remove protocol and www from the URL
  let cleanedUrl = url.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

  // Remove query parameters and hash
  cleanedUrl = cleanedUrl.split(/[?#]/)[0];

  // Split the URL by slashes
  const parts = cleanedUrl.split('/');

  // Find the part that likely contains the product name
  let productName = '';
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] && !isNaN(parts[i])) {
      // Skip numeric parts
      continue;
    }
    if (parts[i]) {
      productName = parts[i];
      break;
    }
  }

  // Replace hyphens with spaces and return the product name
  return productName.replace(/-/g, ' ');
}