const express = require('express');

const { submitFinalTest } = require('../controllers/testController');
const { validateFinalTestSubmission } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/final/submit', validateFinalTestSubmission, submitFinalTest);

module.exports = router;