const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
    {
        directionShown: {
            type: String,
            enum: ['left', 'right'],
            required: true
        },
        userResponse: {
            type: String,
            enum: ['left', 'right', null],
            default: null
        },
        reactionTime: {
            type: Number,
            required: true,
            min: 0
        },
        result: {
            type: String,
            enum: ['correct', 'wrong', 'missed'],
            required: true
        }
    },
    { _id: false }
);

const testResultSchema = new mongoose.Schema(
    {
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Participant',
            required: true,
            unique: true,
            index: true
        },
        responses: {
            type: [responseSchema],
            required: true,
            default: []
        },
        totalPrompts: { type: Number, required: true, min: 0 },
        correct: { type: Number, required: true, min: 0 },
        wrong: { type: Number, required: true, min: 0 },
        missed: { type: Number, required: true, min: 0 },
        averageReactionTime: { type: Number, required: true, min: 0 },
        testDurationSeconds: { type: Number, default: 60 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('TestResult', testResultSchema);