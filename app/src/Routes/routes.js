import express from 'express';
import { createCustomer, getActiveCustomers, deleteCustomer, loginCustomer } from '../Controllers/CustomerController.js'
import { getCards, createCard } from '../Controllers/CardController.js';
import { AuthCustomer } from "../Middleware/Auth.js";

const router = express.Router();


/** Customer API */
router.post('/customer/create', createCustomer);
router.post('/customer/login', loginCustomer)
router.get('/customer/:id/active', AuthCustomer, getActiveCustomers);
router.delete('/customer/delete/:id', AuthCustomer, deleteCustomer);

/** Card API */
router.get('/card/get/:userId', AuthCustomer, getCards);
router.post('/card/create/:userId', AuthCustomer, createCard);


export default router;