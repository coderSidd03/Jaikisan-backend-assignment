import CustomerModel from "../Models/CustomerModel.js";
import { checkEmptyBody, isValid, isValidObjectId, isValidName, isValidPhone, isValidEmail, isValidPassword } from '../Validation/vaidate.js';
import { v4 as uuidV4 } from "uuid";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

// >>>>>>>>>>  function to encrypt a password ============================//
const encryptPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);                          // generating salt
  const encryptedPassword = await bcrypt.hash(pass, salt);        // hashing given password to generate encrypted password 
  return encryptedPassword;
}

// create customer
export const createCustomer = async (req, res) => {
  try {
    // checking if request body is empty
    if (!checkEmptyBody(req.body)) return res.status(400).json({ status: false, message: "please provide details in request body" });

    const { firstName, lastName, mobileNumber, emailID, password, DOB, address } = req.body;

    // checking & validating all the required fields .. if correct then assigning it 
    if (!isValid(firstName)) return res.status(400).json({ status: false, message: "fname is required" });
    if (!isValidName(firstName)) return res.status(400).json({ status: false, message: `fname: ${firstName} is invalid` });

    if (!isValid(lastName)) return res.status(400).json({ status: false, message: "lname is required" });
    if (!isValidName(lastName)) return res.status(400).json({ status: false, message: `lname: ${lastName} is invalid` });

    if (!isValid(mobileNumber)) return res.status(400).json({ status: false, message: "mobile number is required" });
    if (!isValidPhone(mobileNumber)) return res.status(400).json({ status: false, message: `mobile number: ${mobileNumber} is invalid` });

    if (!isValid(emailID)) return res.status(400).json({ status: false, message: "emailID is required" });
    if (!isValidEmail(emailID)) return res.status(400).json({ status: false, message: `emailID: ${emailID} is invalid` });

    // validating and assigning encrypted password
    if (!isValid(password)) return res.status(400).send({ status: false, message: "password is required" });
    if (!isValidPassword(password)) return res.status(400).send({ status: false, message: `provided password: (${password}). is not valid (required at least: 8-16 characters with at least one capital letter, one special character & one number)` });


    if (DOB) {
      if (!isValid(DOB)) return res.status(400).json({ status: false, message: "please provide a date as your date of birth (DOB)" });
      req.body.DOB = new Date(DOB);
    }

    if (address) {
      if (!isValid(address)) return res.status(400).json({ status: false, message: "please provide your address" });
    }


    // checking that email and password must be unique
    let isPresentEmail = await CustomerModel.findOne({ emailID: emailID });
    if (isPresentEmail) return res.status(409).json({ status: false, message: `Email: ${emailID} is already present in DB. please try again with another..` });

    let isPresentPhone = await CustomerModel.findOne({ mobileNumber: mobileNumber });
    if (isPresentPhone) return res.status(409).send({ status: false, message: `mobileNumber: ${mobileNumber} is already present in DB. please try again with another.` });

    const uniqueID = uuidV4();
    req.body.customerID = uniqueID;

    req.body.password = await encryptPassword(password);

    // const customerObject = {
    //   ...req.body,
    //   customerID: uniqueID
    // }

    const customer = await CustomerModel.create(req.body);
    return res.status(201).json({ status: true, message: "customer created successfully", data: customer });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

// login for an existing user
export const loginCustomer = async (req, res) => {

  if (!checkEmptyBody(req.body)) return res.status(400).send({ status: false, message: "please provide email & password" });

  const { emailID, password } = req.body

  try {
    const user = await CustomerModel.findOne({ emailID: emailID })

    if (user) {
      const validity = await bcrypt.compare(password, user.password)
      if (!validity) res.status(400).json({ status: false, message: "Wrong Password !!" })

      const payLoad = {
        userId: user._id.toString(),
        customerName: `${user.fname} ${user.lname}`,
        customerEmail: user['emailID']
      }

      const TOKEN = JWT.sign(payLoad, "-- assignment --", { expiresIn: '3h' });
      res.header('Authorization', TOKEN);

      res.status(201).json({
        status: true,
        message: 'User login successful',
        data: { customerID: `${user.customerID}`, token: TOKEN }
      });
    }
    else {
      res.status(404).json({ status: false, message: "User does not exists" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get active customer 
export const getActiveCustomers = async (req, res) => {
  try {
    const UserIdFromParams = req.params.id;
    if (!isValidObjectId(reqUserId)) return res.status(400).send({ status: false, message: `userId: ${UserIdFromParams}, is invalid.` });

    // authorizing user
    if (UserIdFromParams !== req.userId) return res.status(403).send({ status: false, message: "Unauthorized user access !!!" });           // 403 - not authorized


    const activeCustomers = await CustomerModel.find({ status: "ACTIVE" });
    if (activeCustomers) {
      return res.status(200).json({ status: true, message: "data fetched successfully", data: activeCustomers });
    } else {
      return res.status(400).json({ status: false, message: "no customer found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

// delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const UserIdFromParams = req.params.id;
    if (!isValidObjectId(UserIdFromParams)) return res.status(500).json({ status: false, message: `id: ${UserIdFromParams} is invalid` });

    // authorizing user
    if (UserIdFromParams !== req.userId) return res.status(403).send({ status: false, message: "Unauthorized user access !!!" });           // 403 - not authorized

    const deleteCustomer = await CustomerModel.deleteOne({ _id: UserIdFromParams });
    return res.status(200).json({ status: true, message: 'Success', data: deleteCustomer });

  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}