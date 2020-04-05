const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password has an argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://deco_fullstack:${password}@cluster0-1je7l.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
});

const Person = mongoose.model('Person', phonebookSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  name: `${name}`,
  number: `${number}`,
  date: new Date()
});

if (process.argv.length > 3) {
  person.save().then(response => {
    console.log(
      `added ${response.name} number ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
  return;
}

Person.find({}).then(response => {
  response.forEach(person => {
    console.log(`phonebook: ${person.name} ${person.number}`);
  });
  mongoose.connection.close();
});
