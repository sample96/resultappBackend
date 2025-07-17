import express from 'express';
import { getAllCategories, createCategory, getCategoryById, updateCategory } from '../controllers/categoryController.js';
import { categorySchema } from '../validation/categoryValidation.js';
import Joi from 'joi';

const router = express.Router();

// Validation middleware
const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get all categories
router.get('/', getAllCategories);

// Create new category
router.post('/', validateCategory, createCategory);

// Get category by ID
router.get('/:id', getCategoryById);

// Update category
router.put('/:id', validateCategory, updateCategory);

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;