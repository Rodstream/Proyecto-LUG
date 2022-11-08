import { Schema, model } from "mongoose";

export interface IProdructs{ 
  productId: string,
  amount: number
}

interface ICart {
  productId: string;
  products: IProdructs[];
}

const CartSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    products: [
      {
        productId: { type: String },
        amount: { type: Number, default: 1 }
      },
    ],
});

module.exports = model<ICart>("carts", CartSchema);