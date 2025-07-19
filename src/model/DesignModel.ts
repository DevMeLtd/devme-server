import mongoose, { Document, Schema } from 'mongoose';

export interface IDesignForm extends Document {
  designType: {
    design: string;
  };
  schoolInfo: {
    schoolName: string;
    currentGrade: string;
    contactPerson: {
      name: string;
      contact: string;
    };
  };
  studentInfo: {
    fullName: string;
    dob: Date;
    gender: string;
    contactNumber: string;
    homeAddress: string;
  };
  journey: {
    confidenceLevel: number;
    bigQuestion: string;
    confusingThings: string[];
    growingUp: {
      excites: string;
      worries: string;
    };
  };
  howFound: {
    sources: string[];
    otherSource?: string;
  };
  parentConsent: {
    parentName: string;
    relationship: string;
    contactNumber: string;
    signature: string;
    consentDate: Date;
  };
  additionalDetails: {
    questions: string;
  };
  createdAt: Date;
}

const DesignFormSchema: Schema = new Schema({
  designType: {
    design: { type: String, required: true }
  },
  schoolInfo: {
    schoolName: { type: String, required: true },
    currentGrade: { type: String, required: true },
    contactPerson: {
      name: { type: String, required: true },
      contact: { type: String, required: true }
    }
  },
  studentInfo: {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    homeAddress: { type: String, required: true }
  },
  journey: {
    confidenceLevel: { type: Number, required: true, min: 1, max: 5 },
    bigQuestion: { type: String, required: true },
    confusingThings: { type: [String], required: true },
    growingUp: {
      excites: { type: String, required: true },
      worries: { type: String, required: true }
    }
  },
  howFound: {
    sources: { type: [String], required: true },
    otherSource: { type: String }
  },
  parentConsent: {
    parentName: { type: String, required: true },
    relationship: { type: String, required: true },
    contactNumber: { type: String, required: true },
    signature: { type: String, required: true },
    consentDate: { type: Date, required: true }
  },
  additionalDetails: {
    questions: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDesignForm>('DesignForm', DesignFormSchema);