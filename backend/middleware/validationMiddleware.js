const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateCreateParticipant = (req, res, next) => {
    const requiredFields = [
        'name',
        'dob',
        'age',
        'gender',
        'parentName',
        'std',
        'school',
        'city',
        'contactNo'
    ];

    for (const field of requiredFields) {
        if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
            return next(new ApiError(400, `${field} is required`));
        }
    }

    if (!isNonEmptyString(req.body.name)) return next(new ApiError(400, 'name must be a non-empty string'));
    if (Number.isNaN(new Date(req.body.dob).getTime())) return next(new ApiError(400, 'dob must be a valid date'));
    if (!Number.isInteger(Number(req.body.age)) || Number(req.body.age) <= 0) {
        return next(new ApiError(400, 'age must be a positive integer'));
    }
    if (!isNonEmptyString(req.body.gender)) return next(new ApiError(400, 'gender must be a non-empty string'));
    if (!isNonEmptyString(req.body.parentName)) return next(new ApiError(400, 'parentName must be a non-empty string'));
    if (!isNonEmptyString(req.body.std)) return next(new ApiError(400, 'std must be a non-empty string'));
    if (!isNonEmptyString(req.body.school)) return next(new ApiError(400, 'school must be a non-empty string'));
    if (!isNonEmptyString(req.body.city)) return next(new ApiError(400, 'city must be a non-empty string'));
    if (!isNonEmptyString(req.body.contactNo)) return next(new ApiError(400, 'contactNo must be a non-empty string'));

    return next();
};

const validateFinalTestSubmission = (req, res, next) => {
    const { participantId, responses } = req.body;

    if (!participantId || !mongoose.Types.ObjectId.isValid(participantId)) {
        return next(new ApiError(400, 'participantId is required and must be a valid ObjectId'));
    }

    if (!Array.isArray(responses)) {
        return next(new ApiError(400, 'responses must be an array'));
    }

    const allowedDirection = new Set(['left', 'right']);
    const allowedResult = new Set(['correct', 'wrong', 'missed']);

    for (let index = 0; index < responses.length; index += 1) {
        const item = responses[index];

        if (!item || typeof item !== 'object') {
            return next(new ApiError(400, `responses[${index}] must be an object`));
        }

        if (!allowedDirection.has(item.directionShown)) {
            return next(new ApiError(400, `responses[${index}].directionShown must be 'left' or 'right'`));
        }

        if (!(item.userResponse === 'left' || item.userResponse === 'right' || item.userResponse === null)) {
            return next(new ApiError(400, `responses[${index}].userResponse must be 'left', 'right', or null`));
        }

        if (typeof item.reactionTime !== 'number' || !Number.isFinite(item.reactionTime) || item.reactionTime < 0) {
            return next(new ApiError(400, `responses[${index}].reactionTime must be a non-negative number`));
        }

        if (!allowedResult.has(item.result)) {
            return next(new ApiError(400, `responses[${index}].result must be 'correct', 'wrong', or 'missed'`));
        }
    }

    return next();
};

const validateAdminLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!isNonEmptyString(username)) {
        return next(new ApiError(400, 'username is required'));
    }

    if (!isNonEmptyString(password)) {
        return next(new ApiError(400, 'password is required'));
    }

    return next();
};

module.exports = {
    validateCreateParticipant,
    validateFinalTestSubmission,
    validateAdminLogin
};