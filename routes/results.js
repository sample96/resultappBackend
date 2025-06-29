import express from 'express';
import PDFDocument from 'pdfkit';
import Result from '../models/Result.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get all results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new result
router.post('/', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    await result.populate('category');
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get result by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('category');
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update result
router.put('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');
    
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete result
router.delete('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate PDF for result
// project/server/routes/results.js
router.get('/:id/pdf', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('category');
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="result-${result._id}.pdf"`);

    // Pipe the PDF to response
    const pdfStream = doc.pipe(res);

      doc.fontSize(24).text(`Result: ${result.eventName}`, 100, 100);
    doc.fontSize(18).text(`Category: ${result.category.name}`, 100, 150);
    doc.fontSize(18).text(`Date: ${result.eventDate}`, 100, 200);

    // End the PDF document
    doc.end();

    // Wait for the PDF stream to finish
    pdfStream.on('finish', () => {
      console.log('PDF generated and sent to client');
    });

    pdfStream.on('error', (err) => {
      console.error('Error generating PDF:', err);
      res.status(500).json({ error: 'Error generating PDF' });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

export default router;