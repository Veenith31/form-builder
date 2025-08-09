import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addField, deleteField, updateField, saveFormName, clearForm } from "../redux/formSlice";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fields = useSelector((state: RootState) => state.form.fields);

  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [editId, setEditId] = useState<string | null>(null);
  const [required, setRequired] = useState(true);
  const [minLength, setMinLength] = useState<number | undefined>();
  const [maxLength, setMaxLength] = useState<number | undefined>();
  const [email, setEmail] = useState(false);
  const [passwordRule, setPasswordRule] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const editForm = JSON.parse(localStorage.getItem("editForm") || "null");
    if (editForm) {
      localStorage.removeItem("editForm");
      dispatch(clearForm());
      dispatch(saveFormName(editForm.name));
      editForm.fields.forEach((field: any) => {
        dispatch(addField(field));
      });
      setIsEditing(true);
      setEditingId(editForm.id);
    }
  }, [dispatch]);

  const handleAdd = () => {
    if (!label) return alert("Please enter a label");

    const validations = {
      ...(minLength ? { minLength } : {}),
      ...(maxLength ? { maxLength } : {}),
      ...(email ? { email } : {}),
      ...(passwordRule ? { passwordRule } : {}),
    };

    const fieldData = {
      id: editId || uuidv4(),
      type,
      label,
      required,
      validations,
    };

    if (editId) {
      dispatch(updateField(fieldData));
      setEditId(null);
    } else {
      dispatch(addField(fieldData));
    }

    setLabel("");
    setType("text");
    setRequired(true);
    setMinLength(undefined);
    setMaxLength(undefined);
    setEmail(false);
    setPasswordRule(false);
  };

  const handleEdit = (field: any) => {
    setLabel(field.label);
    setType(field.type);
    setEditId(field.id);
    setRequired(field.required || false);
    setMinLength(field.validations?.minLength);
    setMaxLength(field.validations?.maxLength);
    setEmail(field.validations?.email || false);
    setPasswordRule(field.validations?.passwordRule || false);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setLabel("");
    setType("text");
    setRequired(true);
    setMinLength(undefined);
    setMaxLength(undefined);
    setEmail(false);
    setPasswordRule(false);
  };

  const handlePreview = () => {
    // Just navigate — PreviewForm will pull from Redux
    navigate("/preview");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Create Form</Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField label="Field Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="textarea">Textarea</MenuItem>
          <MenuItem value="select">Select</MenuItem>
          <MenuItem value="radio">Radio</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>

        <FormControlLabel
          control={<Checkbox checked={required} onChange={(e) => setRequired(e.target.checked)} />}
          label="Required"
        />

        {(type === "text" || type === "textarea") && (
          <>
            <TextField
              label="Min Length"
              type="number"
              value={minLength || ""}
              onChange={(e) => setMinLength(Number(e.target.value))}
            />
            <TextField
              label="Max Length"
              type="number"
              value={maxLength || ""}
              onChange={(e) => setMaxLength(Number(e.target.value))}
            />
            <FormControlLabel
              control={<Checkbox checked={email} onChange={(e) => setEmail(e.target.checked)} />}
              label="Email Format"
            />
            <FormControlLabel
              control={<Checkbox checked={passwordRule} onChange={(e) => setPasswordRule(e.target.checked)} />}
              label="Password Rule"
            />
          </>
        )}

        <Button variant="contained" onClick={handleAdd}>
          {editId ? <CheckIcon /> : "Add Field"}
        </Button>

        {editId && (
          <IconButton onClick={handleCancelEdit} color="error">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Typography variant="h6">Form Fields:</Typography>
      <List>
        {fields.map((field) => (
          <ListItem
            key={field.id}
            divider
            secondaryAction={
              <>
                <IconButton onClick={() => handleEdit(field)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => dispatch(deleteField(field.id))} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`${field.label} (${field.type})`}
              secondary={
                <>
                  {field.required && "Required"}{" "}
                  {field.validations?.minLength && `| Min: ${field.validations.minLength} `}
                  {field.validations?.maxLength && `| Max: ${field.validations.maxLength} `}
                  {field.validations?.email && "| Email format "}
                  {field.validations?.passwordRule && "| Password rule "}
                </>
              }
            />
          </ListItem>
        ))}
      </List>

     <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
  <Button
    variant="outlined"
    color="success"
    onClick={() => {
      const formName = prompt("Enter form name:", isEditing ? "" : "");
      if (!formName) return;

      const storedForms = JSON.parse(localStorage.getItem("forms") || "[]");
      let updatedForms;

      if (isEditing && editingId) {
        updatedForms = storedForms.map((form: any) =>
          form.id === editingId
            ? { ...form, name: formName, fields, updatedAt: new Date().toISOString() }
            : form
        );
      } else {
        updatedForms = [
          ...storedForms,
          { id: uuidv4(), name: formName, createdAt: new Date().toISOString(), fields },
        ];
      }

      localStorage.setItem("forms", JSON.stringify(updatedForms));
      alert(isEditing ? "Form updated!" : "Form saved!");
    }}
  >
    {isEditing ? "Update Form" : "Save Form"}
  </Button>

  <Button
    variant="contained"
    color="info"
    onClick={handlePreview}
    disabled={fields.length === 0} // ✅ disable when no fields
  >
    Preview
  </Button>
</Box>

    </Box>
  );
};

export default CreateForm;
