// Result controller placeholder for modular backend

import Result from '../models/Result.js';
import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';

function logAudit(action, req, resultId) {
  const user = req.user ? req.user.id : 'anonymous';
  const logEntry = `${new Date().toISOString()} | ${action} | user: ${user} | resultId: ${resultId || '-'} | ip: ${req.ip}\n`;
  fs.appendFileSync(path.join(process.cwd(), 'server', 'audit.log'), logEntry);
}

// Get all results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new result
export const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    await result.populate('category');
    // logAudit('CREATE_RESULT', req, result._id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get result by ID
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('category');
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update result
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    // logAudit('UPDATE_RESULT', req, result._id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    // logAudit('DELETE_RESULT', req, result._id);
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... existing code ... 