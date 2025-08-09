import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { selectFormById } from "../redux/formSlice";

const MyForms = () => {
  const [forms, setForms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("forms") || "[]");
    setForms(stored);
  }, []);

  const handleView = (formId: string) => {
    selectFormById(formId);
    navigate("/preview");
  };

  const handleEdit = (form: any) => {
    localStorage.setItem("editForm", JSON.stringify(form));
    navigate("/create");
  };

  const handleSubmissions = (formId: string) => {
    navigate(`/submissions/${formId}`);
  };

  const handleDelete = (formId: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      const updated = forms.filter((f) => f.id !== formId);
      setForms(updated);
      localStorage.setItem("forms", JSON.stringify(updated));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Saved Forms</Typography>
      {forms.length === 0 ? (
        <Typography>No forms found. Go to /create to make one.</Typography>
      ) : (
        <List>
          {forms.map((form) => (
            <React.Fragment key={form.id}>
              <ListItem>
                <ListItemText
                  primary={form.name}
                  secondary={`Created at: ${new Date(form.createdAt).toLocaleString()}`}
                />
                <Button onClick={() => handleView(form.id)} sx={{ mr: 1 }}>View</Button>
                <Button onClick={() => handleEdit(form)} sx={{ mr: 1 }} color="warning">
                  Edit
                </Button>
                <Button onClick={() => handleSubmissions(form.id)} sx={{ mr: 1 }} color="success">
                  Submissions
                </Button>
                <Button onClick={() => handleDelete(form.id)} color="error">
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MyForms;
