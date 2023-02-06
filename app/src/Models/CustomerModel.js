import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({

  firstName: { type: String, required: true, trim: true },

  lastName: { type: String, required: true, trim: true },

  mobileNumber: { type: String, required: true, trim: true, max: 10 },

  DOB: { type: Date },

  emailID: { type: String, required: true, trim: true },

  password: { type: String, required: true, trim: true, min: 8, max: 16 },

  address: { type: String, trim: true },

  customerID: { type: String },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"]
  }

}, { timestamps: true });

const CustomerModel = mongoose.model('Customer', CustomerSchema);
export default CustomerModel;