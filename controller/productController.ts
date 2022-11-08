const Product = require("../models/product");
import { Request, Response} from "express";

const productController = {

    addProduct: async (req: Request, res: Response) => {
        const requestData = req.body;
        const products = await Product.find();
    
        if (requestData.name != "" && requestData.price != ""){
        const singleProduct = await products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '')==requestData.name.toLowerCase().replace(/\s/g, ''));
            if (singleProduct == undefined){
            const newProduct = new Product({
                "name": requestData.name,
                "img": requestData.img,
                "genre": requestData.genre,
                "amount": requestData.amount,
                "price": requestData.price
            })
                newProduct.save();
                res.status(201).send("El producto se ha agregado exitosamente");
            }
            else{
                res.status(400).send("El producto ya se encuentra en la base de datos");
            }
            }
        else{
            res.send("Se ha producido un error");
        }
            
    },

    deleteProduct: async (req: Request, res: Response) => {
        const requestData = req.body;
        const products = await Product.find();
        
    
        const product = products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '') === requestData.name.toLowerCase().replace(/\s/g, '')); 
        if (product){
            product.deleteOne({ name: product.name });
            res.status(200).send("El producto se ha eliminado");
        }
    
        else{
            res.status(404).send("El producto no existe");
        }
    
            
    },

    getProducts: async (req: Request, res: Response) => {
        const products = await Product.find();
        
      
        if (products) {
          res.json({ products });
        } else {
          res.send( "No hay productos" );
        }
      },

      getSingleProduct: async (req: Request, res: Response) => {
        const products = await Product.find();
        const productId = req.params.productID.toLowerCase();
        const singleProduct = await products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '')==productId);
        if (singleProduct){
            res.status(200).json(singleProduct);
            console.log("Producto encontrado");  
        }
      
        else if (!singleProduct) {
          res.status(404).send("El producto no existe en nuestro sitio web");
        }
      },

      changeProduct: async (req: Request, res: Response) =>{
        const requestData = req.body;
        const products = await Product.find();
        const singleProduct = await products.find((obj: any) => obj.name.toLowerCase().replace(/\s/g, '')==requestData.name.toLowerCase().replace(/\s/g, ''));
        if (singleProduct){
            singleProduct.price = requestData.price;
            singleProduct.amount = requestData.amount;
            singleProduct.save();
            res.status(200).json(singleProduct);
        }
        else{
            res.status(400).send("Por favor revise los datos ingresados");
        }

      }
}

module.exports = productController;