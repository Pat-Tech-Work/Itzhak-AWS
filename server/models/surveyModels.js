// surveyModels.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    orderNumber: { type: String, required: true },
    email: { type: String, required: true },
    satisfied: { type: String, required: true },
    updates: { type: Boolean, default: false },
    product: { type: String },
    marketplace: { type: String },
    satisfaction: { type: String },
    usageDuration: { type: String },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    submittedAt: { type: Date, default: Date.now },
    couponCode: { type: String },
    couponExpirationDate: { type: Date}, // תוספת
    ipAddress: { type: String },
    review: { type: String }, 

}, { versionKey: false });

surveySchema.index({ orderNumber: 1 }, { unique: true });

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;