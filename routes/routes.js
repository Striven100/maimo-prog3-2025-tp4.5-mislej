import express from "express"
import Route from "../models/routes.js"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const body = req.body
    const name = body.name
    const email = body.email
    const items = body.items
    const total = body.total

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "name/email requerido" })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "items vacío" })
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (!it) {
        return res.status(400).json({ ok: false, error: `item ${i} incompleto` })
      }
      if (!it.productId || !it.name || !it.price || !it.quantity) {
        return res.status(400).json({ ok: false, error: `item ${i} incompleto` })
      }
      if (typeof it.price !== "string") {
        return res.status(400).json({ ok: false, error: `price en item ${i} debe ser string` })
      }
    }

    if (typeof total !== "string" || total === "") {
      return res.status(400).json({ ok: false, error: "total requerido como string" })
    }

    const created = await Route.create({
      name,
      email,
      items,
      total
    })

    return res.status(201).json({ ok: true, route: created })
  } catch (error) {
    return res.status(500).json({ ok: false, error: error && error.message ? error.message : "error" })
  }
})

router.get("/", async (_req, res) => {
  const rows = await Route.find().sort({ createdAt: -1 }).limit(20)
  res.json({ ok: true, routes: rows })
})

export default router
