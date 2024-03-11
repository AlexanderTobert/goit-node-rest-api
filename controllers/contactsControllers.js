import * as contactsService from "../services/contactsServices.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res, next) => {
    try {
        const result = await contactsService.getAllContacts();

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

export const getOneContact = async(req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
    }
    catch(error) {
        next(error);
    }
};

const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await contactsService.addContact(req.body);

        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}

const updateContact = async(req, res, next) => {
    try {
        const {error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const {id} = req.params;
        const result = await contactsService.updateContactById(id, req.body);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
    }
    catch(error) {
        next(error);
    }
}

const deleteContact = async(req, res, next) => {
    try {
        const {id} = req.params;
        const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result)
    }
    catch(error) {
        next(error);
    }
}

export default {
    getAllContacts,
    getOneContact,
    createContact,
    updateContact,
    deleteContact,
}