import { Schema, model } from "mongoose";

interface IProduct {
  name: string,
  img?: string,
  genre?: string,
  amount: number,
  price: number,
  artist?: string
}

const productsSchema = new Schema({
  name: { type: String, required: true, unique: true },
  img: { type: String, required: false },
  genre: { type: String, required: false },
  amount: { type: Number, required: true},
  price: { type: Number, required: true },
  artist: {type: String, required: false}
});

module.exports = model<IProduct>("products", productsSchema);