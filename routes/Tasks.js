const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

//Route to update the status of a task
router.post('/update-status/:id', async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(task);
    } catch (err) {
        console.error('Error updating task status:', err);
        res.status(500).send('Error updating task status');
    }
});

module.exports = router;

// All tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render('index', { tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading tasks');
    }
});

// New tasks
router.post('/add', async (req, res) => {
    const { description, priority } = req.body;
    try {
        await Task.create({ description, priority });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding task');
    }
});

// Finish tasks
router.post('/complete/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed;
        await task.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating task');
    }
});

// Delete tasks
router.post('/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
});

module.exports = router;