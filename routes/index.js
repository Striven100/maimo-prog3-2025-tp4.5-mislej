import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.status(200).send({ message: "API Works!" });
});


export default router;