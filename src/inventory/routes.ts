import { Router } from "express";
import { InventoryService } from "./service";
import { asyncHandler } from "../shared/utils";

export default (inventoryService: InventoryService) => {
  const router = Router();

  router.get(
    "/:productId",
    asyncHandler(async (req, res) => {
      const inventory = await inventoryService.getInventoryForProduct(
        req.params.productId,
      );
      res.json(inventory);
    }),
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { productId, quantity, location } = req.body;
      
      if (!productId || quantity === undefined || !location) {
        return res.status(400).json({ 
          error: 'Missing required fields: productId, quantity, or location' 
        });
      }

      const newInventory = await inventoryService.updateInventory({
        productId,
        quantity: Number(quantity),
        location
      });
      res.status(201).json(newInventory);
    }),
  );

  return router;
};
