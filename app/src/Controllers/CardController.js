import CardModel from '../Models/CardModel'
import CustomerModel from '../Models/CustomerModel';


import { checkEmptyBody, isValid, isValidObjectId, isValidName, isValidPhone, isValidEmail } from '../Validation/vaidate.js';

export const getCards = async (req, res) => {
  try {
    const cards = CardModel.find();
    return res.status(200).json({ status: true, message: 'all cards fetched successfully', data: cards });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

export const createCard = async (req, res) => {
  try {
    const { cardType, customerName, status, vision, customerID } = req.body;
    if (!checkEmptyBody(req.body)) return res.status(400).json({ status: false, message: "request is empty !!" });

    if (!isValid(cardType)) {
      return res.status(400).json({ status: false, message: "cardType is required." });
    } else {
      if (!(cardType === 'REGULAR' || cardType === 'SPECIAL')) return res.status(400).json({ status: false, message: "cardType can only be : REGULAR/SPECIAL" });
    }

    if (!isValid(customerName)) return res.status(400).json({ status: false, message: "customerName is required." });
    if (status) {
      if (!(status === 'ACTIVE' || status === 'INACTIVE')) return res.status(400).json({ status: false, message: "status can only be : ACTIVE/INACTIVE" });
    }

    if (vision) {
      if (!isValid(vision)) return res.status(400).json({ status: false, message: "vision should be a string" });
    }

    if (!isValid(customerID)) {
      return res.status(400).json({ status: false, message: "customerID is required." });
    } else {
      if (!isValidObjectId(customerID)) return res.status(400).json({ status: false, message: `customerID: ${customerID} is invalid.` });

      const customer = await CustomerModel.findById(customerID);
      if (!customer) return res.status(400).json({ status: false, message: `customer with customerID: ${customerID} is not found.` });
    }

    const card = await CardModel.create(req.body);
    return res.status(201).json({ status: true, message: "card created successfully", data: card });
    
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}