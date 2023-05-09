import React, { useState } from "react";
import api from '../api';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    api.post("/api/profiles/", formData)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Create Profile
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Bio"
        name="bio"
        multiline
        rows={4}
        value={formData.bio}
        onChange={handleInputChange}
      />
      <Box marginTop={2} marginBottom={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        )}
      </Box>
    </form>
  );
}

export default ProfileForm;
