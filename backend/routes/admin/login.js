import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  // TEMP ADMIN (remove later)
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      token: process.env.ADMIN_SECRET,
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;