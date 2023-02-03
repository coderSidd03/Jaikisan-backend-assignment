import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({

  firstName: { type: String, required: true, trim: true },

  lastName: { type: String, required: true, trim: true },

  mobileNumber: { type: String, required: true, trim: true, max: 10 },

  DOB: { type: Date },

  emailID: { type: String, required: true, trim: true },

  address: { type: String },

  customerID: { type: String },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"]
  }

}, { timestamps: true });

const CustomerModel = mongoose.model('Customer', CustomerSchema);
export default CustomerModel;