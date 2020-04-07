const express = require('express');
const app = express();
require('dotenv').config();
const Person = require('./models/phonebook');
const morgan = require('morgan');

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

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

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(`<div>This Phonebook has info for ${persons.length} people.</div>
  
    ${new Date()}`);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
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

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedEntry => {
      res.json(updatedEntry.toJSON());
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res
      .status(400)
      .send({ status: 'error', message: 'malfunctioned id' });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
