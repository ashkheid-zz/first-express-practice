'use strict';

//----- requires -----//
const express = require('express');
const _ = require('lodash');
const { check, validationResult } = require('express-validator');


//----- assignments -----//
const route = express.Router();
const customers = require('./data.js');

//----- functions -----//
const sortOut = (obj, query) => {
  // destructuring query
  const { sortBy: sort, orderBy: order } = query;

  // check if there's such property available in obj
  if (_.find(obj, sort)) {
    //sorting
    obj = _.orderBy(
      obj,
      [sort?.toLowerCase() ?? 'id'],
      [order?.toLowerCase() ?? 'asc']
    );
  } else {
    // logging error in console
    console.error(
      `⚠ Sorting by "${sort.toUpperCase()}" isn't available! Please try something else ...`
    );
  }

  return obj;
};

//----- middleware -----//
route.use(express.json());

//----- actual codes -----//

// GET all customers
route.get('/', (req, res) => {
  res.json(customers);
});

// GET a customer by id
route.get('/:id', (req, res) => {
  const targetCustomer = _.find(customers, { id: parseInt(req.params.id) });
  //404 check
  !targetCustomer && res.status(404).send('⚠ Customer not found! ⚠');

  res.json(targetCustomer);
});

/*
// GET customers older than a specific age, sort by a given query
//=> localhost:4000/s/40?sortBy=age&orderBy=desc
route.get('/:age', (req, res) => {
  // filtering out the older ones
  let olderCustomers = _.filter(
    customers,
    (customer) => customer.age > req.params.age
  );

  // if there was any query entered
  if (req.query.sortBy) {
    olderCustomers = sortOut(olderCustomers, req.query);
  }

  res.json(olderCustomers);
});*/

// create a new customer
route.post(
  '/',
  [
    check('last_name')
      .not()
      .isEmpty()
      .withMessage("Last Name shouldn't left empty")
      .isLength({ min: 3, max: 100 })
      .withMessage('last_name must be between 3 and 100 characters'),
    check('email', 'Please enter a valid email').normalizeEmail().isEmail(),
    check('age')
      .isInt({
        min: 10,
        max: 99,
      })
      .withMessage('Age must be greater than 12 and less than 99...'),
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // res.send(req.body);
    const newCustomer = {
      id: ++customers.length,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      age: req.body.age,
    };
    customers.push(newCustomer);
    res.json(newCustomer);
  }
);

//updating existing customer
route.put(
  '/:id',
  [
    check('last_name')
      .not()
      .isEmpty()
      .withMessage("Last Name shouldn't left empty")
      .isLength({ min: 3, max: 100 })
      .withMessage('last_name must be between 3 and 100 characters'),
    check('email', 'Please enter a valid email').normalizeEmail().isEmail(),
    check('age')
      .isInt({
        min: 10,
        max: 99,
      })
      .withMessage('Age must be greater than 12 and less than 99...'),
  ],
  (req, res) => {
    const targetCustomer = _.find(customers, { id: parseInt(req.params.id) });
    //404 check
    !targetCustomer && res.status(404).send('⚠ Customer not found! ⚠');

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Updating
    Object.keys(req.body).forEach(
      (prop) => (targetCustomer[prop] = req.body[prop])
    );

    res.json(targetCustomer);
  }
);

//delete existing customer
route.delete('/:id', (req, res) => {
  const targetCustomer = _.find(customers, { id: parseInt(req.params.id) });
  //404 check
  !targetCustomer && res.status(404).send('⚠ Customer not found! ⚠');

  customers.splice(customers.indexOf(targetCustomer), 1);
  res.status(200).json(targetCustomer);
});

module.exports = route;