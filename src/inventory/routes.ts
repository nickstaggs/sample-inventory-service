import { Router } from 'express';
import { InventoryItem } from '../shared/types';
import inventoryService from './service';

const router = Router();

router.get('/:productId', (req, res) => {
  const inventory = inventoryService.getInventoryForProduct(req.params.productId);
  res.json(inventory);
});

router.post('/', (req, res) => {
  const newInventory = inventoryService.updateInventory(req.body);
  res.status(201).json(newInventory);
});

export default router;
