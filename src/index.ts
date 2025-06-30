import express from 'express';
import cors from 'cors';
import productRoutes from './products/routes';
import inventoryRoutes from './inventory/routes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
