const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['todo', 'doing', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
    },
});

module.exports = mongoose.model('Task', taskSchema);