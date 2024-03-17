import Contact from "../models/Contact.js";

export const getAllContacts = (filter = {}, query = {}) => Contact.find(filter, "-createdAt -updatedAt", query);

export const getOneContact = filter => Contact.findOne( filter )

export const addContact = data => Contact.create(data);

export const updateOneContact = (filter, data) => Contact.findOneAndUpdate(filter, data);

export const removeOneContact = filter => Contact.findOneAndDelete(filter);

export const updateStatusOneContact = (filter, data) => Contact.findOneAndUpdate(filter, data);