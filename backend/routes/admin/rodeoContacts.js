// filepath: backend/routes/admin/rodeoContacts.js

import express from "express";
import prisma from "../../prismaClient.mjs";
import { resolveTenant } from "../../middleware/resolveTenant.js";

const router = express.Router({ mergeParams: true });

/* ---------------------------- */
/* GET CONTACTS FOR RODEO (Tenant Scoped) */
/* GET /api/:tenantSlug/admin/rodeo-contacts/rodeo/:rodeoId */
/* ---------------------------- */
router.get(
  "/:tenantSlug/rodeo/:rodeoId",
  resolveTenant,
  async (req, res) => {
    try {
      const rodeoId = Number(req.params.rodeoId);

      const rodeo = await prisma.rodeo.findFirst({
        where: { id: rodeoId, tenantId: req.tenantId },
      });

      if (!rodeo) {
        return res.status(404).json({ error: "Rodeo not found" });
      }

      const contacts = await prisma.rodeoContact.findMany({
        where: { rodeoId },
        orderBy: { id: "asc" },
      });

      return res.json(contacts || []);
    } catch (err) {
      console.error("ADMIN_RODEO_CONTACTS_GET_ERROR", err);
      return res.status(500).json({ error: "Failed to load rodeo contacts" });
    }
  }
);

/* ---------------------------- */
/* CREATE RODEO CONTACT (Tenant Scoped) */
/* POST /api/:tenantSlug/admin/rodeo-contacts */
/* ---------------------------- */
router.post("/:tenantSlug", resolveTenant, async (req, res) => {
  try {
    const { rodeoId, name, role, phone, email } = req.body;

    const rodeo = await prisma.rodeo.findFirst({
      where: { id: Number(rodeoId), tenantId: req.tenantId },
    });

    if (!rodeo) {
      return res.status(404).json({ error: "Rodeo not found" });
    }

    const contact = await prisma.rodeoContact.create({
      data: {
        rodeoId: Number(rodeoId),
        name,
        role: role || null,
        phone: phone || null,
        email: email || null,
      },
    });

    return res.json(contact);
  } catch (err) {
    console.error("ADMIN_RODEO_CONTACTS_CREATE_ERROR", err);
    return res.status(400).json({ error: "Failed to create rodeo contact" });
  }
});

/* ---------------------------- */
/* UPDATE RODEO CONTACT (Tenant Scoped) */
/* PUT /api/:tenantSlug/admin/rodeo-contacts/:id */
/* ---------------------------- */
router.put("/:tenantSlug/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.rodeoContact.findFirst({
      where: {
        id,
        rodeo: { tenantId: req.tenantId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Rodeo contact not found" });
    }

    const { name, role, phone, email } = req.body;

    const contact = await prisma.rodeoContact.update({
      where: { id },
      data: {
        name,
        role: role || null,
        phone: phone || null,
        email: email || null,
      },
    });

    return res.json(contact);
  } catch (err) {
    console.error("ADMIN_RODEO_CONTACTS_UPDATE_ERROR", err);
    return res.status(400).json({ error: "Failed to update rodeo contact" });
  }
});

/* ---------------------------- */
/* DELETE RODEO CONTACT (Tenant Scoped) */
/* DELETE /api/:tenantSlug/admin/rodeo-contacts/:id */
/* ---------------------------- */
router.delete("/:tenantSlug/:id", resolveTenant, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.rodeoContact.findFirst({
      where: {
        id,
        rodeo: { tenantId: req.tenantId },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Rodeo contact not found" });
    }

    await prisma.rodeoContact.delete({
      where: { id },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("ADMIN_RODEO_CONTACTS_DELETE_ERROR", err);
    return res.status(400).json({ error: "Failed to delete rodeo contact" });
  }
});

export default router;