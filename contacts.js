const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "/db/contacts.json");
const shortid = require("shortid");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return await JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
    return;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    if (!contact)
      return console.error(`Contact with ID ${contactId} not found!`);

    console.log(`Contact with ID ${contactId}:`);
    console.table(contact);
    return contact;
  } catch (error) {
    return console.error(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(({ id }) => id !== contactId);

    if (contacts.length === newContacts.length) {
      return console.error(`Contact with ID ${contactId} not found!`);
    }

    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      "utf8"
    );

    console.log("Contact deleted! New list :");
    console.table(newContacts);

    return newContacts;
  } catch (error) {
    return console.error(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    if (
      contacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    )
      return console.warn("name already exists!");

    if (contacts.find((contact) => contact.email === email))
      return console.warn("email already exists!");

    if (contacts.find((contact) => contact.phone === phone))
      return console.warn("phone already exists!");

    const newContact = { id: shortid.generate(), name, email, phone };
    const newContacts = [...contacts, newContact];

    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      "utf8"
    );

    console.log("Contact added! New list:");
    console.table(newContacts);

    return newContacts;
  } catch (error) {
    return console.error(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
