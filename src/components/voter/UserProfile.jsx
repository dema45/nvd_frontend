import React, { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Navbar from './Navbar';

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: 'Donald Sergeyevich',
    age: '24',
    cid: '10504002345',
    email: 'donald@example.com',
    dzongkhag: 'Thimphu',
    constituency: 'North Thimphu',
    profileImage:
      'https://cdn-icons-png.flaticon.com/512/6522/6522516.png',
    tempProfileImage: '',
  });

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) return;

      const parts = token.split('.');
      if (parts.length !== 3) return;

      const payloadBase64 = parts[1];
      const paddedBase64 = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
      const decodedPayload = JSON.parse(atob(paddedBase64));

      const loggedInVoterId = decodedPayload.cid;
      if (!loggedInVoterId) return;

      try {
        const response = await fetch(`http://localhost:4005/api/voters/getVoter/${loggedInVoterId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const result = await response.json();

        setFormData((prev) => ({
          ...prev,
          username: result.uname || '',
          email: result.email || '',
          cid: result.cid || '',
          age: result.age || '',
          dzongkhag: result.dzongkhag || '',
          constituency: result.constituencies || '',
          profileImage: result.profileImage
            ? `http://localhost:4005/uploads/admin_profiles/${result.profileImage}`
            : prev.profileImage,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        setErrorMessage('Failed to load profile data.');
      }
    };

    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage' && files.length > 0) {
      const previewUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        tempProfileImage: previewUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized. Please log in.');
      return;
    }

    const data = new FormData();
    data.append('uname', formData.username);
    data.append('email', formData.email);
    data.append('age', formData.age);
    data.append('cid', formData.cid);
    data.append('constituencies', formData.constituency);
    data.append('dzongkhag', formData.dzongkhag);

    const fileInput = document.getElementById('upload_profile');
    if (fileInput && fileInput.files.length > 0) {
      data.append('profileImage', fileInput.files[0]);
    }

    setLoading(true);

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const cid = decodedPayload.cid;

      const response = await fetch(`http://localhost:4005/api/voters/update/${cid}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          profileImage: result.profileImage
            ? `http://localhost:4005/uploads/admin_profiles/${result.profileImage}`
            : prev.profileImage,
          tempProfileImage: '',
        }));
        alert('Profile updated successfully!');
      } else {
        setErrorMessage(result.error || 'Update failed');
        alert('Update failed: ' + (result.error || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'Poppins' }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar profileImage={formData.profileImage} />
        <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <section className="py-8 w-full max-w-2xl">
            <div className="w-full mx-auto shadow-2xl p-6 rounded-xl bg-white">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>

              <form onSubmit={handleSubmit} className="grid gap-4">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-[120px] h-[120px] bg-blue-100 rounded-full bg-cover bg-center bg-no-repeat relative"
                    style={{
                      backgroundImage: `url(${formData.tempProfileImage || formData.profileImage})`,
                    }}
                  >
                    <div className="absolute bottom-0 right-0 bg-white/90 rounded-full w-8 h-8 text-center">
                      <input
                        type="file"
                        name="profileImage"
                        id="upload_profile"
                        hidden
                        onChange={handleChange}
                        accept="image/*"
                      />
                      <label
                        htmlFor="upload_profile"
                        className="cursor-pointer flex items-center justify-center h-full w-full"
                      >
                        <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-2">Personal Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm">Full Name</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-2 border-2 rounded-md text-gray-700 border-gray-300 bg-white text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm flex items-center gap-1">
                      CID Number <FaInfoCircle title="CID number cannot be changed" />
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md text-sm">{formData.cid}</div>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-2 border-2 rounded-md text-gray-700 border-gray-300 bg-white text-sm"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border-2 rounded-md text-gray-700 border-gray-300 bg-white text-sm"
                      placeholder="Email"
                    />
                  </div>
                </div>

                {/* Location Info */}
                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2 border-b pb-2">Location Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm flex items-center gap-1">
                      Dzongkhag <FaInfoCircle title="To change this, contact your electoral office" />
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md text-sm">{formData.dzongkhag}</div>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600 text-sm flex items-center gap-1">
                      Constituency <FaInfoCircle title="To change this, contact your electoral office" />
                    </label>
                    <div className="bg-gray-100 p-2 rounded-md text-sm">{formData.constituency}</div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="text-red-500 text-center mt-4">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
