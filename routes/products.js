import express from "express";
const router = express.Router();
import Product from "../models/products.js";

const findAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select("_id name backdrop_path overview rank release_date vote_average vote_count");
    return res.status(200).send({ message: "Todos los productos", products });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};


const findOneProduct = async (req, res) => {
    const {id} = req.params
    try {
        const product = await Product.findOne({_id: id}).select("_id name categories backdrop_path release_date vote_average vote_count")
        return res.status(200).send({message: "Producto encontrado", product})
    } catch (error) {
        return res.status(501).send({message: "Hubo un error", error})
    }
};

const addProduct = async (req, res) => {
    const {name, categories} = req.body;
    try {
        const product = new Product({name, categories});
        await product.save()
        return res.status(200).send({message: "Producto creado", product})
    } catch (error) {
        return res.status(501).send({message: "Hubo un error", error})
    }
}

const deleteProduct = async (req, res) => {
    const {id} = req.params
    try {
        const product = await Product.findOne({_id: id})
        if(!product){
            return res.status(404).send({message: "No existe el producto", id: id})
        }
        await Product.deleteOne({_id: id})
        return res.status(200).send({message: "Producto borrado", product})
    } catch (error) {
        return res.status(501).send({message: "Hubo un error", error})
    }
}

const updateProduct = async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    try {
        const product = await Product.findOne({_id: id})
        if(!product){
            return res.status(404).send({message: "No existe el producto", id: id})
        }

        //Valores a actualizar
        product.name = name

        await product.save()
        return res.status(200).send({message: "Producto actualizado", product})
    } catch (error) {
        return res.status(501).send({message: "Hubo un error", error})
    }
}


//CRUD endpoints
router.get("/", findAllProducts);
router.get("/:id", findOneProduct);
router.post("/", addProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

export default router;
