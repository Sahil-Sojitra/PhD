const express = require('express');

const { createParticipant } = require('../controllers/participantController');
const { validateCreateParticipant } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/', validateCreateParticipant, createParticipant);

module.exports = router;