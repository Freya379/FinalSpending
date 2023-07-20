// Import express
const express = require('express');
// Import jwt
const jwt = require('jsonwebtoken');
// Import middleware
let checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');

const router = express.Router();
// Import moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

// Account book list
router.get('/account', checkTokenMiddleware, function (req, res, next) {
  // Read collection information
  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.json({
        code: '1001',
        msg: 'Fail to Read the data',
        data: null
      })
      return;
    }
    // Respond with success message
    res.json({
      // Response code
      code: '0000',
      // Response message
      msg: 'Successfully read the data',
      // Response data
      data: data
    });
  })
});

// Add record
router.post('/account', checkTokenMiddleware, (req, res) => {
  // Form validation

  // Insert into the database
  AccountModel.create({
    ...req.body,
    // Modify the value of the time attribute
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.json({
        code: '1002',
        msg: 'Failed to create',
        data: null
      })
      return
    }
    // Success reminder
    res.json({
      code: '0000',
      msg: 'Creation successful',
      data: data
    })
  })
});

// Delete record
router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
  // Get the id parameter from params
  let id = req.params.id;
  // Delete
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.json({
        code: '1003',
        msg: 'Failed to delete the record',
        data: null
      })
      return;
    }
    // Reminder
    res.json({
      code: '0000',
      msg: 'Successfully deleted',
      data: {}
    })
  })
});

// Get single record information
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
  // Get id parameter
  let { id } = req.params;
  // Query the database
  AccountModel.findById(id, (err, data) => {
    if (err) {
      return res.json({
        code: '1004',
        msg: 'Fail to Read the data',
        data: null
      })
    }
    // Successful response
    res.json({
      code: '0000',
      msg: 'Successfully read the data',
      data: data
    })
  })
});

// Update single record information
router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
  // Get id parameter value
  let { id } = req.params;
  // Update the database
  AccountModel.updateOne({ _id: id }, req.body, (err, data) => {
    if (err) {
      return res.json({
        code: '1005',
        msg: 'Update failed~~',
        data: null
      })
    }
    // Query the database again to get single record
    AccountModel.findById(id, (err, data) => {
      if (err) {
        return res.json({
          code: '1004',
          msg: 'Fail to Read the data~',
          data: null
        })
      }
      // Successful response
      res.json({
        code: '0000',
        msg: 'Update successful',
        data: data
      })
    })

  });
});

module.exports = router;
