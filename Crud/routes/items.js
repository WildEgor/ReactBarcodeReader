const express = require('express');
const router = express.Router();

// Student model
const Items = require('../models/items');

// @route   GET /api/students/
// @desc    Get all students
// @access  Public
router.get('/', async (req, res) => {
  try {
    const students = await Items.find({});
    res.send({ students })
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

// @route   GET /api/students/:id
// @desc    Get a specific student
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const student = await Items.findById(req.params.id);
    res.send({ student });
  } catch (err) {
    res.status(404).send({ message: 'Товар не найден!' });
  }
});

// @route   POST /api/students/
// @desc    Create a student
// @access  Public
router.post('/', async (req, res) => {
  try {
      const newStudent = await Items.create(
        { articul: req.body.articul, 
          desc: req.body.desc,  
          countAll: req.body.countAll, 
          sold: req.body.sold, 
          remind: req.body.remind, 
          notes: req.body.notes });
     res.send({ newStudent });
  } catch(err) {
    res.status(400).send({ error: err });
  }

});

// @route   PUT /api/students/:id
// @desc    Update a student
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Items.findByIdAndUpdate(req.params.id, req.body);
     res.send({ message: 'Товар был обновлен' });
  } catch(err) {
    res.status(400).send({ error: err });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const removeStudent = await Items.findByIdAndRemove(req.params.id);
     res.send({ message: 'Товар был удален' });
  } catch(err) {
    res.status(400).send({ error: err });
  }
});


module.exports = router;