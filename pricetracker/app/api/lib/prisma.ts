import { Prisma, PrismaClient } from '@prisma/client'
import { comparePasswords } from '@/utils/passwordUtils';

const prisma = new PrismaClient()

interface UserData {
    email: string;
    password: string;
}

interface ProductInput {
  user_email: string;
  name: string;
  url: string;
  image_url: string;
}

interface PriceInput {
  product_id: number;
  price: number;
  date: Date;
}

interface ProductWithLatestPrice {
  id: number;
  name: string;
  url: string;
  imageUrl: string;
  priceString: number;
}

export async function getUsers() {
    const allUsers = await prisma.user.findMany()
    return allUsers;
}

export async function createUser(userData: UserData) {
    const res = await prisma.user.create({
      data: {
        ...userData
      },
    })
    return res;
}

export async function createSimpleUser(email: string) {
  const res = await prisma.user.create({
    data: {
      email
    },
  })
  return res;
}

export async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
      },
    });
    
    return user;
  } catch (error) {
    return 'Error finding user: ' + email;
  } finally {
    await prisma.$disconnect();
  }
}

export async function authorizeUser(email: string, password: string) {
  console.log("AUTHORIZING USER")
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return null;

    const passwordMatch = await comparePasswords(password, user.password!)

    if (!passwordMatch) {
        return null;
    }

    return user;
  } catch (error) {
    return 'Email password combination incorrect';
  } finally {
    await prisma.$disconnect();
  }
}

export async function addProduct(productInput: ProductInput): Promise<number | null> {
  try {
    const createdProduct = await prisma.product.create({
      data: {
        user_email: productInput.user_email,
        name: productInput.name,
        url: productInput.url,
        image_url: productInput.image_url,
        email_decrease: false,
        email_increase: false,
        track_price: true
      },
    });

    console.log('Product added successfully.');
    
    return createdProduct.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

export async function addPrice(priceInput: PriceInput): Promise<void> {
  try {
    await prisma.price.create({
      data: {
        product_id: priceInput.product_id,
        price: priceInput.price,
        date: priceInput.date,
      },
    });
    console.log('Price added successfully.');
  } catch (error) {
    console.error('Error adding price:', error);
  }
}

export async function getProductsWithLatestPrice(userEmail: string): Promise<ProductWithLatestPrice[]> {
  try {
    console.log("email ", userEmail)
    const productsWithLatestPrice = await prisma.product.findMany({
      where: {
        user_email: userEmail,
      },
      include: {
        Price: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    console.log(productsWithLatestPrice);

    return productsWithLatestPrice.map((product) => ({
      id: product.id,
      name: product.name,
      url: product.url,
      imageUrl: product.image_url,
      priceString: product.Price.length > 0 ? parseFloat(product.Price[0].price.toString()) : 0,
    }));
  } catch (error) {
    console.error('Error fetching products with latest price:', error);
    throw new Error('Failed to fetch products with latest price');
  }
}

export async function getProductWithPriceHistory(email: string, productId: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, user_email: email },
      include: { Price: true },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateProductEmailFlags(productId: number, emailIncrease: boolean, emailDecrease: boolean, track_price: boolean): Promise<void> {
  try {
    console.log(emailIncrease)
    console.log(emailDecrease)
    console.log(track_price)
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        email_increase: emailIncrease,
        email_decrease: emailDecrease,
        track_price
      },
    });
    console.log(`Product with ID ${productId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function findExistingProduct(user_email: string, url: string) {
  // check if a product with the same (user_email, url) combination exists
  const existingProduct = await prisma.product.findFirst({
      where: {
          user_email,
          url,
      },
  });
  return existingProduct;
}