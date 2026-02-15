const Participant = require('../models/Participant');
const asyncHandler = require('../middleware/asyncHandler');

const createParticipant = asyncHandler(async (req, res) => {
    const participant = await Participant.create({
        name: req.body.name.trim(),
        dob: new Date(req.body.dob),
        age: Number(req.body.age),
        gender: req.body.gender.trim(),
        parentName: req.body.parentName.trim(),
        std: req.body.std.trim(),
        school: req.body.school.trim(),
        city: req.body.city.trim(),
        contactNo: req.body.contactNo.trim()
    });

    res.status(201).json({
        success: true,
        data: {
            participantId: participant._id,
            hasTakenTest: participant.hasTakenTest
        }
    });
});

module.exports = { createParticipant };