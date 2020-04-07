require('dotenv').config();
const express = require('express');
const Person = require('./models/phonebook');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

morgan.token('data', function(req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null;
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms  :data '
  )
);

app.get('/', (req, res) => {
  res.send('<h1>Phone Book</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  
  ${new Date()}`);
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON());
  });
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end();
  });
});

const generateID = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;

  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  });

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON());
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
