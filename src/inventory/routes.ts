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

  router.put(
    "/",
    asyncHandler(async (req, res) => {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({
          error: "Missing required fields: productId, or quantity",
        });
      }

      const updatedInventory = await inventoryService.updateInventory({
        productId,
        quantity: Number(quantity),
      });
      res.status(200).json(updatedInventory);
    }),
  );

  return router;
};
