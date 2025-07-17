import express from 'express';
import { getAllResults, createResult, getResultById, updateResult, deleteResult } from '../controllers/resultController.js';
import { resultSchema } from '../validation/resultValidation.js';
import Joi from 'joi';

const router = express.Router();

// Validation middleware
const validateResult = (req, res, next) => {
  const { error } = resultSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get all results
router.get('/', getAllResults);

// Create new result
router.post('/', validateResult, createResult);

// Get result by ID
router.get('/:id', getResultById);

// Update result
router.put('/:id', validateResult, updateResult);

// Delete result
router.delete('/:id', deleteResult);

export default router;