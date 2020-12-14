const express = require('express');
const router = express.Router();

// Student model
const Items = require('../models/items.model');

// @route   GET /api/items/
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await Items.find({});
    res.send({ items })
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

// @route   GET /api/items/:id
// @desc    Get a specific items
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    res.send({ item });
  } catch (err) {
    res.status(404).send({ message: 'Товар не найден!' });
  }
});

// @route   POST /api/items/
// @desc    Create a items
// @access  Public
router.post('/', async (req, res) => {
  try {
      const newItem = await Items.create(
        { articul: req.body.articul, 
          desc: req.body.desc,  
          countAll: req.body.countAll, 
          sold: req.body.sold, 
          remind: req.body.remind, 
          notes: req.body.notes });
     res.send({ newItem });
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

// @route   PUT /api/items/:id
// @desc    Update a items
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Items.findByIdAndUpdate(req.params.id, req.body);
     res.send({ message: 'Товар был обновлен' });
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete a items
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const removeItem = await Items.findByIdAndRemove(req.params.id);
    res.send({ message: 'Товар был удален' });
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

module.exports = router;