import express from 'express';
import { createCustomer, getActiveCustomers, deleteCustomer } from '../Controllers/CustomerController.js'
import { getCards, createCard } from '../Controllers/CardController.js';
import { AuthCustomer } from "../Middleware/Auth.js";

const router = express.Router();


/** Customer API */
router.post('/customer/create', createCustomer);
router.get('/customer/:id/active', AuthCustomer, getActiveCustomers);
router.delete('/customer/delete/:id', AuthCustomer, deleteCustomer);

/** Card API */
router.get('/card/get/:userId', AuthCustomer, getCards);
router.post('/card/create', AuthCustomer, createCard);


export default router;