import express from 'express';
import { createCustomer, getActiveCustomer } from '../Controllers/CustomerController.js'
const router = express.Router();



router.post('/customer/create', createCustomer);
router.get('/customer/active', getActiveCustomer);

export default router;