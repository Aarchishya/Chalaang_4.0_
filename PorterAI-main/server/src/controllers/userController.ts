import { Request, Response } from "express";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming /api/users POST:", req.body); // 🔍 log the payload

    const { name, phone, pan, bankAccount } = req.body;

    if (!name || !phone || !pan || !bankAccount) {
      return res.status(400).json({
        error: "Missing required fields",
        received: { name, phone, pan, bankAccount },
      });
    }

    const user = new User({
      name: name.trim(),
      phone: phone.trim(),
      pan: pan.trim(),
      bankAccount: bankAccount.trim(),
    });

    await user.save();
    res.json(user);
  } catch (err: any) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Failed to create user", details: err.message });
  }
};
