import express from "express";
import Route from "../models/routes.js";

const router = express.Router();

function toNumber(val) {
  if (typeof val === "number" && isFinite(val)) return val;
  const parsed = parseFloat(String(val).replace(/[^\d.]/g, ""));
  return isFinite(parsed) ? parsed : NaN;
}

router.post("/", async (req, res) => {
  try {
    const { name, email, items, total } = req.body || {};
    if (!name || !email) return res.status(400).json({ ok: false, error: "name/email requerido" });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ ok: false, error: "items vacío" });

    const normItems = items.map((it, idx) => {
      const productId = String(it.productId || it._id || "").trim();
      const itemName = String(it.name || "").trim();
      const price = toNumber(it.price);
      const quantity = toNumber(it.quantity ?? it.cantidad ?? it.qty ?? 1);
      if (!productId || !itemName) throw new Error(`item ${idx} inválido`);
      if (!isFinite(price)) throw new Error(`price inválido en item ${idx}`);
      if (!isFinite(quantity) || quantity < 1) throw new Error(`quantity inválido en item ${idx}`);
      return { productId, name: itemName, price, quantity };
    });

    const computedTotal = normItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const finalTotal = isFinite(toNumber(total)) ? toNumber(total) : computedTotal;

    const created = await Route.create({ name, email, items: normItems, total: finalTotal });
    return res.status(201).json({ ok: true, route: created });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error?.message || "error" });
  }
});

router.get("/", async (_req, res) => {
  const rows = await Route.find().sort({ createdAt: -1 }).limit(20);
  res.json({ ok: true, routes: rows });
});

export default router;
