import { Router } from "express";
import { ProductService } from "./service";
import { asyncHandler } from "../shared/utils";

export default (productService: ProductService) => {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const products = await productService.getAllProducts();
      res.json(products);
    }),
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { initialQuantity, ...productData } = req.body;
      const newProduct = await productService.createProduct(
        productData,
        initialQuantity,
      );
      res.status(201).json(newProduct);
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const product = await productService.getProductById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send("Product not found");
      }
    }),
  );

  return router;
};
