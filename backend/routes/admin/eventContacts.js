// filepath: backend/routes/admin/eventContacts.js

import express from "express";
import prisma from "../../prismaClient.mjs";

const router = express.Router();

/* ---------------------------- */
/* GET CONTACTS FOR EVENT       */
/* ---------------------------- */
router.get("/event/:eventId", async (req, res) => {
  const eventId = Number(req.params.eventId);

  const contacts = await prisma.eventContact.findMany({
    where: { eventId },
    orderBy: { id: "asc" },
  });

  res.json(contacts);
});

/* ---------------------------- */
/* CREATE EVENT CONTACT         */
/* ---------------------------- */
router.post("/", async (req, res) => {
  const { eventId, name, role, phone, email } = req.body;

  const contact = await prisma.eventContact.create({
    data: {
      eventId: Number(eventId),
      name,
      role: role || null,
      phone: phone || null,
      email: email || null,
    },
  });

  res.json(contact);
});

/* ---------------------------- */
/* UPDATE EVENT CONTACT         */
/* ---------------------------- */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, role, phone, email } = req.body;

  const contact = await prisma.eventContact.update({
    where: { id },
    data: {
      name,
      role: role || null,
      phone: phone || null,
      email: email || null,
    },
  });

  res.json(contact);
});

/* ---------------------------- */
/* DELETE EVENT CONTACT         */
/* ---------------------------- */
router.delete("/:id", async (req, res) => {
  await prisma.eventContact.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ success: true });
});

export default router;
