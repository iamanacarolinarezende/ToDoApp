const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.use(express.json());

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
    const { description, priority, status = "todo" } = req.body;
    
    try {
        await Task.create({ description, priority, status });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding task');
    }
});

// Complete task
router.post('/complete/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        // Alternando entre "done" e "todo"
        task.status = task.status === "done" ? "todo" : "done";
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
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true } 
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json({ success: true, task });
    } catch (err) {
        console.error("Error updating task status:", err);
        res.status(500).json({ error: "Error updating task status" });
    }
});

// Rota para atualizar status da tarefa
router.post('/update-status/:id', async (req, res) => {
    console.log('🔍 Rota update-status chamada');
    console.log('📌 Task ID:', req.params.id);
    console.log('📝 Status recebido:', req.body.status);
    console.log('🧩 Corpo completo da requisição:', req.body);

    try {
        // Valide o status
        const validStatuses = ['todo', 'doing', 'done'];
        if (!validStatuses.includes(req.body.status)) {
            return res.status(400).json({ 
                error: "Status inválido", 
                validStatuses: validStatuses 
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { 
                new: true,  // Retorna o documento atualizado
                runValidators: true  // Força validação do schema
            }
        );

        if (!task) {
            console.error('❌ Tarefa não encontrada');
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }

        console.log('✅ Tarefa atualizada com sucesso:', task);
        res.status(200).json(task);

    } catch (err) {
        console.error('🚨 Erro detalhado na atualização:', err);
        res.status(500).json({ 
            error: "Erro ao atualizar tarefa", 
            details: err.message 
        });
    }
});


// Router export
module.exports = router;