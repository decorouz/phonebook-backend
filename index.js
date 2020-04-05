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

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4
  }
];

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
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
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

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateID()
  };

  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
