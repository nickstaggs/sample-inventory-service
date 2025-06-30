import { Router } from 'express';
import { InventoryService } from './service';
import { asyncHandler } from '../shared/utils';

export default (inventoryService: InventoryService) => {
  const router = Router();

  router.get('/:productId', asyncHandler(async (req, res) => {
    const inventory = await inventoryService.getInventoryForProduct(req.params.productId);
    res.json(inventory);
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const newInventory = await inventoryService.updateInventory(req.body);
    res.status(201).json(newInventory);
  }));

  return router;
};
