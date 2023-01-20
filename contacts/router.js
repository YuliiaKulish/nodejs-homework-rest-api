const express = require("express");

const {
  validationAddedContact,
  validationUpdatedContact,
  validateMongoId,
  validateUpdateFavorite,
} = require("../middlewares/validation");

const router = express.Router();

const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("./controllers");

router.get("/", listContacts).post("/", validationAddedContact, addContact);

router
  .get("/:contactId", validateMongoId, getContactById)
  .delete("/:contactId", validateMongoId, removeContact)
  .put("/:contactId", validateMongoId, validationUpdatedContact, updateContact);

router.patch(
  "/:contactId/favorite",
  validateMongoId,
  validateUpdateFavorite,
  updateStatusContact
);

module.exports = router;
