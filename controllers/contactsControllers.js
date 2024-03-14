import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {

    const result = await contactsService.getAllContacts();
    res.json(result);

}

export const getOneContact = async(req, res) => {

    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404);
    }

    res.json(result);

};

const createContact = async (req, res) => {

    const result = await contactsService.addContact(req.body);

    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    
    const {id} = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
        throw HttpError(404);
    }

    res.json(result);

}

const deleteContact = async(req, res) => {

    const {id} = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
        throw HttpError(404);
    }

    res.json(result)
}

const updateContactStatus = async(req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;
    const result = await contactsService.updateStatusContact(id, { favorite });
    if (!result) {
        throw HttpError(404);
    }

    res.json(result)
}

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateContactStatus: ctrlWrapper(updateContactStatus),
}