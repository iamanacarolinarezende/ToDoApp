const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const taskRoutes = require('./routes/tasks');

const app = express();
 
//MongoDB Atlas
const mongoURI = "mongodb+srv://cre8webinc:Fx8JRTWnSouhgJ5q@cluster0.jqprt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//MongoDB Atlas Connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

// Express Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//// MongoDB Connection
//mongoose.connect('mongodb://localhost:27017/todo-list', {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
//})
//.then(() => console.log('Conectado ao MongoDB'))
//.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Express Settings
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', taskRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});