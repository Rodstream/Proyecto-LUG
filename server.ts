import express, { Express } from "express";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cartControllers = require("./controller/cartController");
const productControllers = require("./controller/productController");
dotenv.config();

const app: Express = express();
const port = 4000

app.use(express.json());  

// Funcion para conectarse a Mongo
const database = process.env.URL;
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('Conexion exitosa'))
.catch((err: any) => console.log(err));


app.get('/', (req, res) => {
  res.send("Hola Mundo");
})

app.get("/products", productControllers.getProducts);
app.get("/products/:productID", productControllers.getSingleProduct);
app.get("/carts", cartControllers.getCart); 

app.post("/cart", cartControllers.addToCart);
app.post("/products", productControllers.addProduct);

app.put("/cart/:productId/:userId/:amount?", cartControllers.changeAmount);
app.put("/products", productControllers.changeProduct);

app.delete("/cart/delete", cartControllers.deleteFromCart);
app.delete("/products", productControllers.deleteProduct);

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`)
})
 