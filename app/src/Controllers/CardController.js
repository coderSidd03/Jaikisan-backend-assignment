import CardModel from '../Models/CardModel.js'
import CustomerModel from '../Models/CustomerModel.js';
import { validate as uuidValidate } from 'uuid';


import { checkEmptyBody, isValid, isValidObjectId } from '../Validation/vaidate.js';

export const getCards = async (req, res) => {
  try {
    const userIdFromParams = req.params.userId;
    if (!isValidObjectId(userIdFromParams)) return res.status(400).send({ status: false, message: `userId: ${userIdFromParams}, is invalid.` });

    // authorizing user
    if (userIdFromParams !== req.userId) return res.status(403).send({ status: false, message: "Unauthorized user access !!!" });                   // 403 - not authorized

    const customer = await CustomerModel.findById(userIdFromParams);
    const customerId = customer.customerID;

    const cards = await CardModel.find({ customerID: customerId });
    return res.status(200).json({ status: true, message: "user's all cards fetched successfully", data: cards });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export const createCard = async (req, res) => {
  try {
    const UserIdFromParams = req.params.userId;
    const { cardType, customerName, status, vision, customerID } = req.body;

    if (!checkEmptyBody(req.body)) return res.status(400).json({ status: false, message: "request is empty !!" });

    if (!isValidObjectId(UserIdFromParams)) return res.status(400).send({ status: false, message: `userId: ${UserIdFromParams}, is invalid.` });

    // authorizing user
    if (UserIdFromParams !== req.userId) return res.status(403).send({ status: false, message: "Unauthorized user access !!!" });                   // 403 - not authorized

    if (!isValid(cardType)) {
      return res.status(400).json({ status: false, message: "cardType is required." });
    } else {
      req.body.cardType = cardType.toUpperCase().trim();

      if (!(cardType === 'REGULAR' || cardType === 'SPECIAL')) return res.status(400).json({ status: false, message: "cardType can only be : REGULAR/SPECIAL" });
    }

    const getCustomer = await CustomerModel.findById(UserIdFromParams);
    if (!getCustomer) return res.status(404).json({ status: false, message: "customer is not found." });

    if (customerName) return res.status(400).json({ status: false, message: `please remove customerName.` });


    req.body.customerName = `${getCustomer.firstName} ${getCustomer.lastName}`



    if (status) {
      req.body.status = status.toUpperCase().trim();

      if (!(status === 'ACTIVE' || status === 'INACTIVE')) return res.status(400).json({ status: false, message: "status can only be : ACTIVE/INACTIVE" });
    }


    if (vision) {
      if (!isValid(vision)) return res.status(400).json({ status: false, message: "vision should be a string" });
    }

    if (customerID) {

      if (!uuidValidate(customerID)) return res.status(400).json({ status: false, message: `customerID: ${customerID} is invalid.` });

      if (customerID !== getCustomer.customerID) return res.status(400).json({ status: false, message: `customerID: ${customerID} mismatch.` });

    } else {
      req.body.customerID = getCustomer.customerID;
    }


    const findCards = await CardModel.find({ customerID: req.body.customerID })
      .sort({ cardNumber: -1 })
      .collation({ locale: "en_US", numericOrdering: true });

    let cardObj = {
      ...req.body
    }

    if (findCards.length > 0) {
      cardObj['cardNumber'] = parseInt(findCards[0].cardNumber) + 1;
    } else {
      cardObj['cardNumber'] = 1
    }



    const card = await CardModel.create(cardObj);
    return res.status(201).json({ status: true, message: "card created successfully", data: card });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}