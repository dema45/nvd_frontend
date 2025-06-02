import React, { useState } from "react";
export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [voterDetails, setVoterDetails] = useState({
    name: "Dorji Wangmo",
    cid: "11707000882",
    email: "dorji@example.com",
    dzongkhag: "Mongar",
    constituency: "Mongar Constituency",
    password: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => setProfileImage(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoterDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Details:", voterDetails);
    alert("Profile updated successfully!");
    // TODO: Send updated data to your backend or blockchain
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* Profile Picture */}
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input type="file" onChange={handleImageChange} className="text-sm" />
          {profileImage && (
            <button
              onClick={handleImageDelete}
              className="text-red-500 text-sm hover:underline"
            >
              Delete Picture
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={voterDetails.name}
              disabled
              className="w-full mt-1 px-3 py-2 bg-gray-100 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">CID</label>
            <input
              type="text"
              value={voterDetails.cid}
              disabled
              className="w-full mt-1 px-3 py-2 bg-gray-100 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={voterDetails.email}
              disabled
              className="w-full mt-1 px-3 py-2 bg-gray-100 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Dzongkhag</label>
            <input
              type="text"
              name="dzongkhag"
              value={voterDetails.dzongkhag}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Constituency</label>
            <input
              type="text"
              name="constituency"
              value={voterDetails.constituency}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Change Password</label>
            <input
              type="password"
              name="password"
              value={voterDetails.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded"
              placeholder="Enter new password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
