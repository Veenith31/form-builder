import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Field {
  id: string;
  type: string;
  label: string;
  required: boolean;
  validations?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
}

interface FormState {
  formName: string;
  fields: Field[];
}

const initialState: FormState = {
  formName: "",
  fields: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Field>) => {
      state.fields.push(action.payload);
    },
    saveFormName: (state, action: PayloadAction<string>) => {
      state.formName = action.payload;
    },
    updateField: (state, action: PayloadAction<Field>) => {
      const index = state.fields.findIndex(
        (f) => f.id === action.payload.id
      );
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(
        (field) => field.id !== action.payload
      );
    },
    clearForm: (state) => {
      state.formName = "";
      state.fields = [];
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  saveFormName,
  clearForm,
} = formSlice.actions;

export default formSlice.reducer;

// Save a form to localStorage
export const saveFormToLocalStorage = (
  formName: string,
  fields: Field[]
) => {
  const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
  storedForms.push({
    id: uuidv4(),
    name: formName,
    createdAt: new Date().toISOString(),
    fields,
  });
  localStorage.setItem("forms", JSON.stringify(storedForms));
};

// Store the selected form in localStorage
export const selectFormById = (formId: string) => {
  const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
  const selected = storedForms.find((f: any) => f.id === formId);
  if (selected) {
    localStorage.setItem("selectedForm", JSON.stringify(selected));
  }
};
