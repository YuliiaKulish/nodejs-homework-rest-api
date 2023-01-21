const ContactSchema = require("./schema");

const listContacts = async (req, res) => {
  const contacts = await ContactSchema.find();
  res.json({ status: "success", code: 200, payload: contacts });
};

const getContactById = async (req, res) => {
  const id = req.params.contactId;
  const contact = await ContactSchema.findById(id);
  if (!contact) {
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found." });
  }
  return res.json({
    status: "success",
    code: 200,
    payload: contact,
  });
};

const addContact = async (req, res) => {
  const newContact = ContactSchema.create(req.body);
  return res.status(201).json({
    status: "success",
    code: 201,
    message: "New contact was created.",
    payload: newContact,
  });
};

const removeContact = async (req, res) => {
  const id = req.params.contactId;
  const contact = await ContactSchema.findByIdAndDelete(id);
  if (!contact) {
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found." });
  }
  return res.json({
    status: "success",
    code: 200,
    message: "Contact deleted.",
  });
};

const updateContact = async (req, res) => {
  const updateContact = await ContactSchema.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  if (!updateContact) {
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found." });
  }
  return res.json({
    status: "success",
    code: 200,
    message: "Contact updated.",
    payload: updateContact,
  });
};

const updateStatusContact = async (req, res) => {
  const updateStatusContact = await ContactSchema.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  if (!updateStatusContact) {
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found." });
  }

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Contact updated.",
    payload: updateStatusContact,
  });
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
