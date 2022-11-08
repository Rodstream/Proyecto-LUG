const Cart = require("../models/cart");
const Product = require("../models/product");
import { Request, Response} from "express";

const cartController = {

    deleteFromCart: async (req: Request, res: Response) => {
        const productsCart = await Cart.find();
        const products = await Product.find();
        const requestData = req.body;
      
        const userCart = productsCart.find((obj: any) => obj.userId === requestData.username);
        const isInCart = userCart.products.find((obj: any) => obj.productId.toLowerCase().replace(/\s/g, '') === requestData.name.toLowerCase().replace(/\s/g, ''));
        // primero revisamos si el usuario cuenta con un carrito
        if(!userCart){
            res.status(400).send("El usuario no cuenta con ningun carrito");
        }
    
        else{
            // revisamos si el producto se encuentra en el carrito
            if(!isInCart){
                res.status(400).send("El producto no se encuentra en el carrito");
            }
            // si el producto se encuentra en el carrito, lo eliminamos
            else{
                const arrIndex = userCart.products.findIndex((obj: any) => obj.productId.toLowerCase().replace(/\s/g, '') === requestData.name.toLowerCase().replace(/\s/g, ''));
                userCart.products.splice(arrIndex, 1);
                userCart.save();
                res.json(userCart.products);
            }
    
        }
    },


    addToCart: async (req: Request, res: Response) => {
        const productsCart = await Cart.find();
        const products = await Product.find();
        const requestData = req.body;
    
        const isItProducts = products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '') === requestData.name.toLowerCase().replace(/\s/g, '')); 
        const userCart = productsCart.find((obj: any) => obj.userId === requestData.username); 
    
        // revisamos si el producto a agregar se encuentra en la base de datos
        if(!isItProducts){
            res.status(400).send("El producto no se encuentra disponible");
        }
    
        // si el carrito no existe, lo creamos
        if(!userCart){
            const newCart = new Cart({
                "userId": requestData.username,
                "products": []
            })
            newCart.save();
        }
    
        else{
            
    
            // revisamos si el carrito ya cuenta con el producto agregado
            const isInCart = userCart.products.find((obj: any) => obj.productId.toLowerCase().replace(/\s/g, '') === requestData.name.toLowerCase().replace(/\s/g, '')); 
            
            // si el item esta en el carrito, no hacemos nada
            if(isInCart){
                res.status(400).send("El producto ya se encuentra en el carrito");
            }
    
            // si el item no esta en el carrito, lo agregamos
            else if (!isInCart){
                if(isItProducts.amount > 0){
                const orderObj = {"productId": requestData.name, "amount": requestData.amount}
                userCart.products.push(orderObj);
                userCart.save();
                res.status(201).json(productsCart);
              }
              else{
                res.status(400).send("No hay stock dispoible");
              }
            }
            
        }
    
    },

      getCart: async (req: Request, res: Response) => {
        const productsCart = await Cart.find();
      
        if (productsCart) {
          res.send({ productsCart });
          console.log("El carrito se ha obtenido")
        } else {
          res.status(400).send("No hay productos en el carrito");
        }
      },

    changeAmount: async (req: Request, res: Response) => {
        const productsCart = await Cart.find();
        const products = await Product.find();
      
        const userId = req.params.userId.toLowerCase();
        const productId = req.params.productId.toLowerCase();
        const amount = parseInt(req.params.amount) || 1;
      
        const isItProducts = products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '') === productId.toLowerCase().replace(/\s/g, '')); 
        const userCart = productsCart.find((obj: any) => obj.userId.toLowerCase() === userId.toLowerCase()); 
        const isInCart = userCart.products.find((obj: any) => obj.productId.toLowerCase().replace(/\s/g, '') === productId.toLowerCase().replace(/\s/g, '')); 
      
        if(!isItProducts){
          res.status(400).send("El producto no se encuentra disponible");
       }
      
        else if(!isInCart){
          res.status(400).send("El producto no se encuentra en el carrito");
       }
      
       else{
          const singleProduct = userCart.products.find((obj: any) => obj.productId.toLowerCase().replace(/\s/g, '') === productId.toLowerCase().replace(/\s/g, '')); 
          if (singleProduct.amount + amount >= 1 && isItProducts.amount >= singleProduct.amount + amount){
              singleProduct.amount +=  amount;
              userCart.save();
              res.status(200).json(userCart);
          }
          else{
              res.status(400).send("No se cuentan con los suficientes elementos en el carrito para eliminar o no se cuenta con el stock disponible");
          }
          
       }
      
        
      }
}

module.exports = cartController;