const express = require('express');
const mongoose = require('mongoose');

const {
    loginAdmin,
    getParticipantTestSummaries,
    getParticipantTestDetail,
    exportAllResponsesCsv
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { validateAdminLogin } = require('../middleware/validationMiddleware');
const ApiError = require('../utils/ApiError');

const router = express.Router();

router.post('/login', validateAdminLogin, loginAdmin);

router.use(protectAdmin);

router.get('/participants/summaries', getParticipantTestSummaries);

router.get('/participants/:participantId', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.participantId)) {
        return next(new ApiError(400, 'participantId must be a valid ObjectId'));
    }

    return getParticipantTestDetail(req, res, next);
});

router.get('/export/csv', exportAllResponsesCsv);

module.exports = router;