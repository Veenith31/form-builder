import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  FormControlLabel,
  Button,
  Alert,
  RadioGroup,
  Radio
} from "@mui/material";

const PreviewForm = () => {
  const [formFields, setFormFields] = useState<any[]>([]);
  const [formName, setFormName] = useState("");
  const [formId, setFormId] = useState("");
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem("selectedForm") || "null");
    if (selected) {
      setFormFields(selected.fields);
      setFormName(selected.name);
      setFormId(selected.id);
    }
  }, []);

  const validateField = (field: any, value: string) => {
    let error = "";

    if (field.required && !value) {
      error = "This field is required.";
    }

    if (field.validations?.minLength && value.length < field.validations.minLength) {
      error = `Minimum length is ${field.validations.minLength}.`;
    }

    if (field.validations?.maxLength && value.length > field.validations.maxLength) {
      error = `Maximum length is ${field.validations.maxLength}.`;
    }

    if (field.validations?.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format.";
      }
    }

    if (field.validations?.passwordRule && value) {
      const passwordRegex = /^(?=.*\d).{8,}$/;
      if (!passwordRegex.test(value)) {
        error = "Password must be at least 8 characters and include a number.";
      }
    }

    return error;
  };

  const handleChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));

    const field = formFields.find(f => f.id === id);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach(field => {
      const value = formValues[field.id] || "";
      const error = validateField(field, value);
      if (error) newErrors[field.id] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const storedResponses = JSON.parse(localStorage.getItem("formResponses") || "[]");

      storedResponses.push({
        formId,
        formName,
        submittedAt: new Date().toISOString(),
        responses: formValues
      });

      localStorage.setItem("formResponses", JSON.stringify(storedResponses));

      alert("Form submitted successfully!");
      setFormValues({});
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>{formName || "Preview Form"}</Typography>

      {formFields.length === 0 ? (
        <Alert severity="info">No fields found. Go to /create and save a form first.</Alert>
      ) : (
        <form>
          {formFields.map(field => {
            const value = formValues[field.id] || "";
            const error = errors[field.id];

            return (
              <Box key={field.id} sx={{ mb: 2 }}>
                <Typography>{field.label}</Typography>

                {["text", "number", "date"].includes(field.type) && (
                  <TextField
                    type={field.type}
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    error={!!error}
                    helperText={error}
                    fullWidth
                  />
                )}

                {field.type === "textarea" && (
                  <TextField
                    multiline
                    rows={4}
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    error={!!error}
                    helperText={error}
                    fullWidth
                  />
                )}

                {field.type === "checkbox" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value || false}
                        onChange={(e) => handleChange(field.id, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                )}

                {field.type === "radio" && (
                  <RadioGroup
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <FormControlLabel value="Option 1" control={<Radio />} label="Option 1" />
                    <FormControlLabel value="Option 2" control={<Radio />} label="Option 2" />
                  </RadioGroup>
                )}

                {field.type === "select" && (
                  <Select
                    value={value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="Option 1">Option 1</MenuItem>
                    <MenuItem value="Option 2">Option 2</MenuItem>
                  </Select>
                )}
              </Box>
            );
          })}

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      )}
    </Box>
  );
};

export default PreviewForm;
