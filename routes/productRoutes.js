import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.post('/:id/reviews', protect, createReview);

export default router;