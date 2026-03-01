// filepath: backend/routes/admin/eventContacts.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { getCurrentTenant } from "../../utils/getTenant.js";

const router = express.Router();

/* ---------------------------- */
/* GET CONTACTS FOR EVENT       */
/* ---------------------------- */
router.get("/event/:eventId", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const eventId = Number(req.params.eventId);

    // Ensure event belongs to tenant
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        tenantId: tenant.id,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const contacts = await prisma.eventContact.findMany({
      where: { eventId },
      orderBy: { id: "asc" },
    });

    res.json(contacts);
  } catch (error) {
    console.error("GET EVENT CONTACTS ERROR:", error);
    res.status(500).json({ error: "Failed to load contacts" });
  }
});

/* ---------------------------- */
/* CREATE EVENT CONTACT         */
/* ---------------------------- */
router.post("/", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { eventId, contactRole, officerRole } = req.body;

    if (!eventId || !contactRole || !officerRole) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure event belongs to tenant
    const event = await prisma.event.findFirst({
      where: {
        id: Number(eventId),
        tenantId: tenant.id,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const contact = await prisma.eventContact.create({
      data: {
        eventId: Number(eventId),
        contactRole,
        officerRole,
      },
    });

    res.json(contact);
  } catch (error) {
    console.error("CREATE EVENT CONTACT ERROR:", error);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

/* ---------------------------- */
/* UPDATE EVENT CONTACT         */
/* ---------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);
    const { contactRole, officerRole } = req.body;

    const existing = await prisma.eventContact.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!existing || existing.event.tenantId !== tenant.id) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const contact = await prisma.eventContact.update({
      where: { id },
      data: {
        contactRole,
        officerRole,
      },
    });

    res.json(contact);
  } catch (error) {
    console.error("UPDATE EVENT CONTACT ERROR:", error);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

/* ---------------------------- */
/* DELETE EVENT CONTACT         */
/* ---------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const tenant = await getCurrentTenant();
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const id = Number(req.params.id);

    const existing = await prisma.eventContact.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!existing || existing.event.tenantId !== tenant.id) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await prisma.eventContact.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE EVENT CONTACT ERROR:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

export default router;
