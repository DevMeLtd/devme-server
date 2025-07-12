import express from 'express';
import {
  createDesignForm,
  getAllDesignForms,
  getDesignFormById
} from '../controller/DesignController';

const designRouter = express.Router();

designRouter.post('/createdesign', createDesignForm);
designRouter.get('/getalldesign', getAllDesignForms);
designRouter.get('/getonedesign/:id', getDesignFormById);

export default designRouter;