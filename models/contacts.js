const ContactSchema = require("./schemas");

const listContacts = async () => {
  return await ContactSchema.find();
};

const getContactById = async (contactId) => {
  return await ContactSchema.findById(contactId);
};

const addContact = async (body) => {
  return await ContactSchema.create(body);
};

const removeContact = async (contactId) => {
  return await ContactSchema.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, body) => {
  return await ContactSchema.findByIdAndUpdate(
    contactId,
    { ...body },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
