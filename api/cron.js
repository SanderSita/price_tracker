import { openURLmakeScreenshot } from "./ocr.js";
import { PrismaClient } from '@prisma/client';
import { sendMail } from "./mail.js";
import cron from 'node-cron';

const prisma = new PrismaClient();

async function updatePrices() {
  try {
    // Fetch all products
    const products = await prisma.product.findMany({
      where: {
        track_price: true
      }
    });

    for (const product of products) {
      const email = product.user_email;
      const oldPrice = await getProductLatestPrice(email, product.id);

      const productFound = await openURLmakeScreenshot(product.url);

      const newPrice = convertPriceStringToFloat(productFound.priceString);

      if(newPrice != oldPrice && (product.email_decrease || product.email_increase)) {
        // notify user
        if((product.email_decrease && newPrice < oldPrice) || (product.email_increase && newPrice > oldPrice)) {
            sendMail(email, product.name, newPrice < oldPrice, parseFloat(oldPrice).toFixed(2), parseFloat(newPrice).toFixed(2), product.image_url, product.url);
        }
      }

      // Add the price
      await prisma.price.create({
        data: {
          product_id: product.id,
          price: newPrice,
          date: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error updating prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function convertPriceStringToFloat(priceString) {
    console.log("before: ", priceString)
      // Remove currency symbols and any non-numeric characters
      const cleanedPriceString = priceString.replace(/[^\d,.]/g, '');
  
      // Replace comma with dot for decimal separator
      const normalizedPriceString = cleanedPriceString.replace(',', '.');
  
      // Parse the string as a float
      const price = parseFloat(normalizedPriceString);
  
      console.log("after: ", price)
      return price;
}

async function getProductLatestPrice(email, productId) {
  try {
    // Find the product by ID and email
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        user_email: email
      },
      include: {
        Price: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        }
      }
    });

    if (!product) {
      throw new Error("Product not found for the given email and ID.");
    }

    if (!product.Price || product.Price.length === 0) {
      throw new Error("No price found for the given product.");
    }

    // Return the latest price
    return product.Price[0].price;
  } catch (error) {
    console.error("Error retrieving product price:", error);
    throw error;
  }
}

const cronExpression = '* * * * 0';

cron.schedule(cronExpression, () => {
  updatePrices();
});
