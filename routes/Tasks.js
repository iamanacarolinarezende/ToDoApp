const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

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

// Add a new task
router.post('/add', async (req, res) => {
    const { description, priority } = req.body;
    
    try {
        await Task.create({ description, priority, status: "todo" });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding task');
    }
});

// Complete task
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

// Delete task
router.post('/delete/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting task');
    }
});

// Update task
router.post('/update-status/:id', async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        task.status = status; 
        await task.save();
        res.status(200).json(task); 
        console.error('Error updating task status:', err);
        res.status(500).send('Error updating task status');
    }
});

// Router export
module.exports = router;