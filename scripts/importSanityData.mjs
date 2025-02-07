import { createClient } from '@sanity/client';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Create Sanity client
const client = createClient({
  projectId: 'zjf7u783',
  dataset: 'production',
  useCdn: true,
  token: 'sk4JJe9Nz0QKxbU3UqmbZdUjFuXLPVOaCClCNuUatAhrRI56lxwRHNJ2ZgNSIOx0Ocuzmf0BMz4pgxi5QNkM8irIhs08o2FE0j3Rx08jyUoqzSpEhAerbcMJoxujCkFyDtFDo6ZNDsHhtU6octqbTIIm7YRd7SP1nlaWACuSlfllmH9ERGf1',
  apiVersion: '2025-01-13',
});

// Upload Image to Sanity
async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error);
    return null;
  }
}

// Import Data to Sanity
async function importData() {
  try {
    console.log('Fetching products from API...');
    const response = await axios.get('https://template1-neon-nu.vercel.app/api/products');
    const products = response.data;

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("API response is empty or not an array");
    }
    
    console.log(`Fetched ${products.length} products`);

    for (const product of products) {
      if (!product || !product.title) {
        console.log("Skipping undefined product:", product);
        continue; // Skip undefined products
      }

      console.log(`Processing product: ${product.title}`);

      let imageRef = null;
      if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
        imageRef = await uploadImageToSanity(product.image);
      }

      const sanityProduct = {
        _type: 'product',
        name: product.title || "Untitled",
        description: product.description || "",
        price: product.price || 0,
        discountPercentage: 0,
        priceWithoutDiscount: product.price || 0,
        rating: product.rating?.rate || 0,
        ratingCount: product.rating?.count || 0,
        tags: product.category ? [product.category] : [],
        sizes: [],
        image: imageRef ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageRef,
          },
        } : undefined,
      };

      console.log(`Uploading product to Sanity: ${sanityProduct.name}`);
      const result = await client.create(sanityProduct);
      console.log(`Product uploaded successfully: ${result._id}`);
    }
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();
