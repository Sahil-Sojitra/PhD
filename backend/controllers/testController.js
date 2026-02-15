const mongoose = require('mongoose');
const Participant = require('../models/Participant');
const TestResult = require('../models/TestResult');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');

const calculateStats = (responses) => {
    const totalPrompts = responses.length;
    const correct = responses.filter((item) => item.result === 'correct').length;
    const wrong = responses.filter((item) => item.result === 'wrong').length;
    const missed = responses.filter((item) => item.result === 'missed').length;

    const validReactionTimes = responses
        .map((item) => item.reactionTime)
        .filter((reactionTime) => typeof reactionTime === 'number' && Number.isFinite(reactionTime) && reactionTime >= 0);

    const averageReactionTime =
        validReactionTimes.length > 0
            ? Number((validReactionTimes.reduce((sum, value) => sum + value, 0) / validReactionTimes.length).toFixed(2))
            : 0;

    return {
        totalPrompts,
        correct,
        wrong,
        missed,
        averageReactionTime
    };
};

const submitFinalTest = asyncHandler(async (req, res, next) => {
    const { participantId, responses } = req.body;
    const stats = calculateStats(responses);
    const session = await mongoose.startSession();
    let savedTestResult;

    try {
        await session.withTransaction(async () => {
            const participant = await Participant.findById(participantId).session(session);

            if (!participant) {
                throw new ApiError(404, 'Participant not found');
            }

            if (participant.hasTakenTest) {
                throw new ApiError(409, 'Final test already submitted for this participant');
            }

            const created = await TestResult.create(
                [
                    {
                        participant: participant._id,
                        responses,
                        ...stats,
                        testDurationSeconds: 60
                    }
                ],
                { session }
            );

            savedTestResult = created[0];
            participant.hasTakenTest = true;
            await participant.save({ session });
        });
    } catch (error) {
        if (error && error.code === 11000) {
            return next(new ApiError(409, 'Final test already submitted for this participant'));
        }

        return next(error);
    } finally {
        await session.endSession();
    }

    return res.status(201).json({
        success: true,
        data: {
            participantId,
            testResultId: savedTestResult._id,
            ...stats
        }
    });
});

module.exports = { submitFinalTest };