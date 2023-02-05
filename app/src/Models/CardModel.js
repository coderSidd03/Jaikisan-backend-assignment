import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const CardSchema = new mongoose.Schema({
  cardNumber: { type: String },
  cardType: { type: String, enum: ["REGULAR", "SPECIAL"] },
  customerName: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  vision: { type: String },
  customerID: {
    type: ObjectId,
    ref: "Customer"
  }
}, { timestamps: true });

const CardModel = mongoose.model("Card", CardSchema);
export default CardModel;