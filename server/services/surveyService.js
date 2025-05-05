// surveyService.js

const surveyRepo = require('../repositories/surveyRepo');

const getAllSurveys = async () => await surveyRepo.getAllSurveys();
const getSurveyById = async (id) => await surveyRepo.getSurveyById(id);
const getSurveyByOrderNumber = async (orderNumber) => await surveyRepo.getSurveyByOrderNumber(orderNumber);
const createSurvey = async (data) => {
    return await surveyRepo.createSurvey(data);
};
const updateSurvey = async (id, data) => await surveyRepo.updateSurvey(id, data);
const deleteSurvey = async (id) => await surveyRepo.deleteSurvey(id);

module.exports = {
    getAllSurveys,
    getSurveyById,
    getSurveyByOrderNumber,
    createSurvey,
    updateSurvey,
    deleteSurvey,
};