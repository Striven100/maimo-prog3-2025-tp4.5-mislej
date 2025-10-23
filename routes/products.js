import express from "express";
const router = express.Router();
import Product from "../models/products.js";

const findAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select("_id name backdrop_path overview rank release_date vote_average vote_count price");
    return res.status(200).send({ message: "Todos los productos", products });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};


const findOneProduct = async (req, res) => {
    const {id} = req.params
    try {
        const product = await Product.findOne({_id: id}).select("_id name categories backdrop_path release_date vote_average vote_count price")
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

        product.name = name

        await product.save()
        return res.status(200).send({message: "Producto actualizado", product})
    } catch (error) {
        return res.status(501).send({message: "Hubo un error", error})
    }
}

router.get("/", async (_req, res) => {
  try {
    const rows = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ ok: true, products: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const name = body.name;
    if (!name) return res.status(400).json({ ok: false, error: "name requerido" });

    const doc = await Product.create({
      name: body.name,
      pixelData: Array.isArray(body.pixelData) ? body.pixelData : [],
      description: body.description,
      backdrop_path: body.backdrop_path,
      price: body.price,
      categories: Array.isArray(body.categories) ? body.categories : []
    });

    return res.status(201).json({ ok: true, product: doc });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "error" });
  }
});



router.get("/", findAllProducts);
router.get("/:id", findOneProduct);
router.post("/", addProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

export default router;
