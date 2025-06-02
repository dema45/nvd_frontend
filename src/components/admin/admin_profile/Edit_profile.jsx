import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
let result;
const EditProfile = ({ onProfileUpdate, id }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    sex: '',
    dob: '',
    profileImage: 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png',
    tempProfileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getData = async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      console.error('No JWT token found in localStorage');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Token should have three parts.');
      }

      const payloadBase64 = parts[1];
      const paddedBase64 = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
      const decodedPayload = JSON.parse(atob(paddedBase64));
      const logged_in_user_id = decodedPayload.id;

      console.log('Decode:', logged_in_user_id);

      if (logged_in_user_id) {
          try {
            const response = await fetch(`http://localhost:4005/api/admin/${logged_in_user_id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });
            result = await response.json();
            console.log(result.adminName)
          } catch (error) {
            console.error('Error fetching admin name:', error);
          }
        }


      setFormData((prev) => ({
        ...prev,
        username: result.adminName || '',
        email: result.email || '',
        sex: result.sex || '',
        dob: result.dob ? result.dob.split('T')[0] : '', 
        profileImage: result.profileImage ? `http://localhost:4005/uploads/admin_profiles/${result.profileImage}`: prev.profileImage,
      }));

    } catch (error) {
      console.error('Error during fetch or token decoding:', error.message);
      setErrorMessage('Error loading profile data.');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage' && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
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

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('You are not authorized. Please log in.');
      return;
    }

    const data = new FormData();
    data.append('adminname', formData.username);
    data.append('email', formData.email);
    data.append('sex', formData.sex);
    data.append('dob', formData.dob);

    const fileInput = document.getElementById('upload_profile');
    if (fileInput.files.length > 0) {
      data.append('profileImage', fileInput.files[0]);
    }

    setLoading(true);

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const logged_in_user_id = decodedPayload.id;

      const response = await fetch(`http://localhost:4005/api/admin/update/${logged_in_user_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();
      console.log(result.profileImage);

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          profileImage: result.profileImage,
          tempProfileImage: null,
        }));

        if (typeof onProfileUpdate === 'function') {
          onProfileUpdate(result.profileImage);
        }

        alert('Profile updated successfully!');
      } else {
        setErrorMessage(result.error || 'Update failed');
        alert('Update failed: ' + (result.error || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Something went wrong. Please try again.');
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'Poppins' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar profileImage={formData.profileImage} />
        <main className="flex-1 overflow-y-auto p-4">
          <section className="py-8">
            <div className="lg:w-[60%] md:w-[75%] w-[96%] mx-auto flex gap-4">
              <div className="w-full mx-auto shadow-2xl p-6 rounded-xl bg-white">
                <div className="text-left mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                  <h2 className="text-gray-500 text-sm">Update your profile information</h2>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="col-span-2 flex justify-center mb-6">
                    <div
                      className="w-[120px] h-[120px] rounded-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${formData.tempProfileImage || formData.profileImage})` }}
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
                        <label htmlFor="upload_profile" className="cursor-pointer flex items-center justify-center h-full w-full">
                          <svg className="w-5 h-5 text-blue-700" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-600 text-sm">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="p-3 w-full border-2 rounded-md text-sm text-gray-700 border-gray-300"
                      placeholder="Username"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-600 text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="p-3 w-full border-2 rounded-md text-sm text-gray-700 border-gray-300"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-600 text-sm">Sex</label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className="p-3 w-full border-2 rounded-md text-sm text-gray-700 border-gray-300"
                    >
                      <option disabled value="">Select Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-600 text-sm">Date Of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="p-3 w-full border-2 rounded-md text-sm text-gray-700 border-gray-300"
                    />
                  </div>

                  {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                  <div className="col-span-2 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
