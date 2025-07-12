import { Request, Response } from 'express';
import DesignForm from '../model/DesignModel';

export const createDesignForm = async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    const newForm = new DesignForm(formData);
    await newForm.save();
    res.status(201).json({ success: true, data: newForm });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getAllDesignForms = async (req: Request, res: Response) => {
  try {
    const forms = await DesignForm.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: forms });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getDesignFormById = async (req: Request, res: Response): Promise<any> => {
  try {
    const form = await DesignForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, error: 'Form not found' });
    }
    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};