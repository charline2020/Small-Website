const express = require('express');
const contactFormModel = require('../../models/contactForm');
const router = express.Router();

const bodyParser = require('body-parser'); // Middleware
// Include Express Validator Functions
const { check, validationResult } = require('express-validator');
router.use(bodyParser.urlencoded({ extended: false }));

// Validation Array
var inputValidate = [
  // Check email
  check('name').trim().isLength({ min: 2, max: 10 }).isString()  
  .matches(/^[A-Za-z\s]+$/),
  
  check('email','Must Be an Email Address').isEmail()
  .trim().escape().normalizeEmail(),

  check('message').trim().isLength({ min: 5, max: 200 }).matches(/^[A-Za-z\s]+$/).escape()
  ];

router.get('/', (req, res) => {
  res.render('Homepage');
})

// POST route to handle form submission
router.post('/submit', inputValidate, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate data
    // if (!name || !email || !message) {
    //   return res.status(400).render('error', { message: 'All fields are required.' });
    // }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).json({ errors: errors.array() });
      return res.status(422).render('form-error',{ 
        message: 'Please check Name, Email, Message are all correct.',
        redirectUrl: '/'
      });
    }

    // Use `contactFormModel.create()` to save the data
    await contactFormModel.create({ name, email, message });
    // Render success page
    res.render('success', {
      message: 'Message received!',
      redirectUrl: '/' // Adjust if necessary
    });
  } catch (err) {
    console.error('Error adding contact form entry:', err);
    res.status(500).render('error', {
      message: 'Failed to add contact form entry. Please try again later.'
    });
  }
});


module.exports = router;