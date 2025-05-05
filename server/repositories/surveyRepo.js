// surveyRepo.js
const Survey = require('../models/surveyModels');

const getAllSurveys = async () => await Survey.find();
const getSurveyById = async (id) => await Survey.findById(id);
const getSurveyByOrderNumber = async (orderNumber) => await Survey.findOne({ orderNumber });
const createSurvey = async (surveyData) => {
    const survey = new Survey(surveyData);
    return await survey.save();
};

const updateSurvey = async (id, updatedData) => await Survey.findByIdAndUpdate(id, updatedData, { new: true });
const deleteSurvey = async (id) => await Survey.findByIdAndDelete(id);

module.exports = {
    getAllSurveys,
    getSurveyById,
    getSurveyByOrderNumber,
    createSurvey,
    updateSurvey,
    deleteSurvey,
};