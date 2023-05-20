const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();
const PORT=process.env.PORT||3000


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}).then(() => {
     
     app.listen(PORT, () => {
          console.log(`Listening on port ${PORT}`);
          console.log('And Connected to MongoDB');
     })
}).catch(err => {
     console.error(err);
});

// Configure middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

// Define schema and model for todo item
const todoSchema = new mongoose.Schema({
     title: String,
     description: String,
     completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// Define routes
app.get('/', async (req, res) => {
     const todos = await Todo.find({});
     res.render('index', { todos });
});

// app.get('/todos/new', (req, res) => {
//      res.render('new');
// });

app.post('/todos', async (req, res) => {
     const todo = new Todo({
          title: req.body.title,
          description: req.body.description,
          completed: false
     });

     await todo.save();
     res.redirect('/');
});

app.get('/todos/:id/edit', async (req, res) => {
     const todo = await Todo.findById(req.params.id);
     res.render('edit', { todo });
});

app.put('/todos/:id', async (req, res) => {
     const { title, description, completed } = req.body;
     const todo = await Todo.findByIdAndUpdate(req.params.id, { title, description, completed });
     res.redirect('/');
});

app.delete('/todos/:id', async (req, res) => {
     await Todo.findByIdAndDelete(req.params.id);
     res.redirect('/');
});

//Start the server

