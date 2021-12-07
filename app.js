'use strict';

//----- requires -----//
const express = require('express');
const customers = require('./routes/customers.js');

//----- assignments -----//
const app = express();
const currentPort = process.env.PORT || 4000;

//----- middleware -----//
app.use(express.json());
app.use('/api/customer', customers);

//----- actual codes -----//
app.get('/', (req, res) => {
  res.send(`This is HOME...\nStarted on port:${currentPort}`);
});

app.get('/about', (req, res) => {
  res.send('About us...');
});

app.listen(currentPort, (error) => {
  if (error) {
    console.log('Something went wrong... \n error: ', error);
  } else {
    console.log(`Listening to requests on http://localhost:${currentPort}...`);
  }
});
