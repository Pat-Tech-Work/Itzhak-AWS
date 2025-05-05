// orderNumberRepo.js - עם לוגים משופרים
const OrderNumber = require("../models/orderNumberModels");

const createOrderNumber = async (orderNumberData) => {
  return await OrderNumber.create(orderNumberData);
};

module.exports = {
  createOrderNumber
};
