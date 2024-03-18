import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 3 } = req.query;
    const skip = (page - 1) * limit;
    const result = await contactsService.getAllContacts({owner}, {skip, limit});
    res.json(result);

}

export const getOneContact = async(req, res) => {

    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.getContactById({_id: id, owner});
    if (!result) {
        throw HttpError(404);
    }

    res.json(result);

};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await contactsService.addContact({ ...req.body, owner });

    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.updateOneContact({_id: id, owner}, req.body);
    if (!result) {
        throw HttpError(404);
    }

    res.json(result);

}

const deleteContact = async(req, res) => {

    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeOneContact({_id: id, owner});
    if (!result) {
        throw HttpError(404);
    }

    res.json(result)
}

const updateContactStatus = async(req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const { favorite } = req.body;
    const result = await contactsService.updateStatusOneContact({_id: id, owner}, { favorite });
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