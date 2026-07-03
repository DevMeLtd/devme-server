"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesignFormById = exports.getAllDesignForms = exports.createDesignForm = void 0;
const DesignModel_1 = __importDefault(require("../model/DesignModel"));
const createDesignForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body;
        const newForm = new DesignModel_1.default(formData);
        yield newForm.save();
        res.status(201).json({ success: true, data: newForm });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.createDesignForm = createDesignForm;
const getAllDesignForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forms = yield DesignModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: forms });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.getAllDesignForms = getAllDesignForms;
const getDesignFormById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield DesignModel_1.default.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ success: false, error: 'Form not found' });
        }
        res.status(200).json({ success: true, data: form });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.getDesignFormById = getDesignFormById;
