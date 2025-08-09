import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const location = useLocation();

  // Get formId from URL query params
  const queryParams = new URLSearchParams(location.search);
  const formId = queryParams.get("formId");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("formResponses") || "[]");

    if (formId) {
      // Filter only submissions for this form
      const filtered = stored.filter((res: any) => res.formId === formId);
      setSubmissions(filtered);
    } else {
      // Show all submissions if no formId given
      setSubmissions(stored);
    }
  }, [formId]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {formId ? "Form Submissions" : "All Submissions"}
      </Typography>

      {submissions.length === 0 ? (
        <Alert severity="info">
          {formId ? "No submissions found for this form." : "No submissions found."}
        </Alert>
      ) : (
        <List>
          {submissions.map((submission, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={`Submitted at: ${new Date(
                    submission.submittedAt
                  ).toLocaleString()}`}
                  secondary={
                    <List>
                      {Object.entries(submission.responses).map(([fieldId, value]) => (
                        <ListItem key={fieldId} sx={{ py: 0 }}>
                          <ListItemText
                            primary={`${fieldId}: ${String(value)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ViewSubmissions;
