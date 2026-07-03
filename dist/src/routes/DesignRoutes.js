"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DesignController_1 = require("../controller/DesignController");
const designRouter = express_1.default.Router();
designRouter.post('/createdesign', DesignController_1.createDesignForm);
designRouter.get('/getalldesign', DesignController_1.getAllDesignForms);
designRouter.get('/getonedesign/:id', DesignController_1.getDesignFormById);
exports.default = designRouter;
