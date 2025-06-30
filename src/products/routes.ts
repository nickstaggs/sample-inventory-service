import { Router } from 'express';
import { Product } from '../shared/types';
import productService from './service';

const router = Router();

// Temporary in-memory storage
const products: Product[] = [];

router.get('/', (req, res) => {
  res.json(productService.getAllProducts());
});

router.post('/', (req, res) => {
  const newProduct = productService.createProduct(req.body);
  res.status(201).json(newProduct);
});

router.get('/:id', (req, res) => {
  const product = productService.getProductById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;
