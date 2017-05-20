const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./router/users');

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log(`Mongodb connected to database: ${config.database}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Database error: ${err}`);
})


const port = 3000;
const app = express();

app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/users', users);
app.get('/', (req, res) => {
  res.json({
    message: 'This is Home'
  });
})

app.listen(port, () => console.log(`Server started on port: ${port}!`));
