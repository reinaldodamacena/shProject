import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileForm from './ProfileForm';

function ProfileView() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/profile/')
      .then(response => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (formData) => {
    setLoading(true);
    axios.put('/api/profiles/', formData)
      .then(response => {
        setProfileData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <ProfileForm data={profileData} onSubmit={handleSubmit} />
    </div>
  );
}

export default ProfileView;
