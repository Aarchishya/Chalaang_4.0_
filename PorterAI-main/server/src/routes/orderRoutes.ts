import express from "express";
import Order from "../models/Order";

const router = express.Router();

// create (already had)
router.post("/create", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order", details: err });
  }
});

// update (already had)
router.put("/modify/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// get by id
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// delete
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// list orders (recent, optionally by customer name or assignedTo)
router.get("/list", async (req, res) => {
  const { customerName, assignedTo, limit = 10 } = req.query;
  const filter: any = {};
  if (customerName) filter.customerName = String(customerName);
  if (assignedTo) filter.assignedTo = String(assignedTo);
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
  res.json(orders);
});

// track by trackingId
router.get("/track/:trackingId", async (req, res) => {
  const order = await Order.findOne({ trackingId: req.params.trackingId });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
