import express from "express";
const router = express.Router();
import Product from "../models/products.js";

const findAllProducts = async (req, res) => {

};


//CRUD endpoints
router.get("/", findAllProducts);

export default router;
