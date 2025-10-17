// routes/routes.js
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// ⬇️ MODELO inline: Order (colección "orders")
const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      cardLast4: { type: String, required: true } // solo últimos 4
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name:      { type: String, required: true },           // snapshot del nombre
        price:     { type: String, default: 'undefined' },     // snapshot textual (ej. "0.08 ETH" o "$ 20")
        quantity:  { type: Number, default: 1 }
      }
    ],
    total: { type: Number, default: 0 } // snapshot numérico
  },
  { timestamps: true }
)
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

// ⬇️ ENDPOINT: crear orden
router.post('/orders', async (req, res) => {
  try {
    const { buyer, items, total } = req.body
    if (!buyer?.firstName || !buyer?.lastName || !buyer?.cardLast4) {
      return res.status(400).json({ error: 'Datos de comprador incompletos' })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No hay items en la orden' })
    }

    const doc = await Order.create({
      buyer: {
        firstName: String(buyer.firstName).trim(),
        lastName:  String(buyer.lastName).trim(),
        cardLast4: String(buyer.cardLast4).slice(-4)
      },
      items: items.map(it => ({
        productId: it.productId, // string de ObjectId
        name:      String(it.name || ''),
        price:     typeof it.price === 'string' ? it.price : 'undefined',
        quantity:  Number(it.quantity) || 1
      })),
      total: Number(total) || 0
    })

    return res.status(201).json({ order: doc })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'No se pudo crear la orden' })
  }
})

// ✅ export existente
module.exports = router
