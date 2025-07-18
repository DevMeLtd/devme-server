"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DesignFormSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('DesignForm', DesignFormSchema);
