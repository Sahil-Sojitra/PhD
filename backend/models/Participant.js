const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        dob: { type: Date, required: true },
        age: { type: Number, required: true, min: 1 },
        gender: { type: String, required: true, trim: true },
        parentName: { type: String, required: true, trim: true },
        std: { type: String, required: true, trim: true },
        school: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        contactNo: { type: String, required: true, trim: true },
        hasTakenTest: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Participant', participantSchema);