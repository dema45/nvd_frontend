// ProfilePage.js
import React, { useState } from 'react';
import EditProfile from './Edit_profile';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxwcm9maWxlfGVufDB8MHx8fDE7MTEwMDM0MjN8MA&ixlib=rb-4.0.3&q=80&w=1080',
    username: 'johndoe123'
  });

  const handleProfileUpdate = (updatedData) => {
    setProfileData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  return (
    <div>
      <EditProfile 
        onProfileUpdate={handleProfileUpdate} 
        initialUsername={profileData.username}
      />
    </div>
  );
};

export default ProfilePage;