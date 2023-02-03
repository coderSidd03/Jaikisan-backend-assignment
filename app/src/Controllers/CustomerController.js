import CustomerModel from "../Models/CustomerModel.js";
import { checkEmptyBody, isValid, isValidName, isValidPhone, isValidEmail } from '../Validation/vaidate.js';
import { v4 as uuidV4 } from "uuid";


export const createCustomer = async (req, res) => {
  try {
    // checking if request body is empty
    if (!checkEmptyBody(req.body)) return res.status(400).send({ status: false, message: "please provide details in request body" });

    const { firstName, lastName, mobileNumber, emailID, DOB, address } = req.body;

    // checking & validating all the required fields .. if correct then assigning it 
    if (!isValid(firstName)) return res.status(400).send({ status: false, message: "fname is required" });
    if (!isValidName(firstName)) return res.status(400).send({ status: false, message: `fname: ${firstName} is invalid` });

    if (!isValid(lastName)) return res.status(400).send({ status: false, message: "lname is required" });
    if (!isValidName(lastName)) return res.status(400).send({ status: false, message: `lname: ${lastName} is invalid` });

    if (!isValid(mobileNumber)) return res.status(400).send({ status: false, message: "mobile number is required" });
    if (!isValidPhone(mobileNumber)) return res.status(400).send({ status: false, message: `mobile number: ${mobileNumber} is invalid` });

    if (!isValid(emailID)) return res.status(400).send({ status: false, message: "emailID is required" });
    if (!isValidEmail(emailID)) return res.status(400).send({ status: false, message: `emailID: ${emailID} is invalid` });


    if (DOB) {
      if (!isValid(DOB)) return res.status(400).send({ status: false, message: "please provide a date as your date of birth (DOB)" });
      req.body.DOB = new Date(DOB);
    }

    if (address) {
      if (!isValid(address)) return res.status(400).send({ status: false, message: "please provide your address" });
    }

    const uniqueID = uuidV4();
    req.body.customerID = uniqueID

    // const customerObject = {
    //   ...req.body,
    //   customerID: uniqueID
    // }

    const customer = await CustomerModel.create(req.body);
    return res.status(201).send({ status: true, message: "customer created successfully", data: customer });

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

export const getActiveCustomer = async (req, res) => {
  try {
    const activeCustomers = await CustomerModel.find({ status: "ACTIVE" });
    return res.status(200).send({ status: true, message: "data fetched successfully", data: activeCustomers });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}