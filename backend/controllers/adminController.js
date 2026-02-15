const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

const TestResult = require('../models/TestResult');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const loginAdmin = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_JWT_SECRET) {
        return next(new ApiError(500, 'Admin auth environment variables are not configured'));
    }

    const isUsernameMatch = username === process.env.ADMIN_USERNAME;
    const isPasswordMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isUsernameMatch || !isPasswordMatch) {
        return next(new ApiError(401, 'Invalid admin credentials'));
    }

    const token = jwt.sign({ username }, process.env.ADMIN_JWT_SECRET, {
        expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '12h'
    });

    return res.status(200).json({
        success: true,
        data: { token }
    });
});

const getParticipantTestSummaries = asyncHandler(async (req, res) => {
    const results = await TestResult.find()
        .populate('participant', 'name age gender school city hasTakenTest')
        .sort({ createdAt: -1 })
        .lean();

    const summaries = results.map((item) => ({
        participantId: item.participant?._id,
        participantName: item.participant?.name,
        age: item.participant?.age,
        gender: item.participant?.gender,
        school: item.participant?.school,
        city: item.participant?.city,
        hasTakenTest: item.participant?.hasTakenTest,
        totalPrompts: item.totalPrompts,
        correct: item.correct,
        wrong: item.wrong,
        missed: item.missed,
        averageReactionTime: item.averageReactionTime,
        submittedAt: item.createdAt
    }));

    res.status(200).json({
        success: true,
        count: summaries.length,
        data: summaries
    });
});

const getParticipantTestDetail = asyncHandler(async (req, res, next) => {
    const { participantId } = req.params;

    const testResult = await TestResult.findOne({ participant: participantId })
        .populate(
            'participant',
            'name dob age gender parentName std school city contactNo hasTakenTest createdAt updatedAt'
        )
        .lean();

    if (!testResult) {
        return next(new ApiError(404, 'Test data not found for participant'));
    }

    return res.status(200).json({
        success: true,
        data: testResult
    });
});

const exportAllResponsesCsv = asyncHandler(async (req, res) => {
    const results = await TestResult.find().populate('participant', 'name age').lean();

    const rows = [];

    results.forEach((item) => {
        if (!item.responses || !item.participant) return;

        item.responses.forEach((response) => {
            rows.push({
                ParticipantName: item.participant.name,
                Age: item.participant.age,
                DirectionShown: response.directionShown,
                UserResponse: response.userResponse,
                ReactionTime: response.reactionTime,
                Result: response.result
            });
        });
    });

    const fields = ['ParticipantName', 'Age', 'DirectionShown', 'UserResponse', 'ReactionTime', 'Result'];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('reaction_time_responses.csv');
    res.status(200).send(csv);
});

module.exports = {
    loginAdmin,
    getParticipantTestSummaries,
    getParticipantTestDetail,
    exportAllResponsesCsv
};