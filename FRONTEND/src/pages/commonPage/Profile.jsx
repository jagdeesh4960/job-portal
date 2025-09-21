import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Phone, Mail, Edit3, Save, Pencil, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { logOutUser, updateProfile, updateProfileImage } from "../../features/auth/authThunks.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters, AiOutlineCheckCircle } from "react-icons/ai";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(user?.profileImage?.url);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    dispatch(updateProfile(formData));
    setEditMode(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please select an image.");

    setUploading(true);
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await dispatch(updateProfileImage(formData));
      setImage(result.payload);
      setUploadSuccess(true);
    } catch (error) {
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(false), 2000);
    }
  };

  const handleRemoveImage = async () => {
    const formData = new FormData();
    formData.append("remove", "true");

    setUploading(true);
    setUploadSuccess(false);

    try {
      const result = await dispatch(updateProfileImage(formData));
      setImage(null);
      setUploadSuccess(true);
    } catch (err) {
      alert("Failed to remove image");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(false), 2000);
    }
  };



  const handleLogOut = () => {
    dispatch(logOutUser())
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">No user info</h2>
          <p className="text-sm text-gray-600 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-4 min-h-[calc(100vh-4rem)] bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-900">Your Profile</h2>
          <button
            onClick={() => !uploading && setEditMode(!editMode)}
            disabled={uploading}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full ${uploading
              ? "bg-blue-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            <Pencil size={16} />
            {editMode ? "Cancel" : "Edit"}
          </button>

        </div>

        <div className="flex flex-col items-center gap-3 text-center mb-8">

          {uploading && (
            <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
              <AiOutlineLoading3Quarters className="animate-spin" size={18} />
              Processing...
            </div>
          )}
          {uploadSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
              <AiOutlineCheckCircle size={18} />
              Photo updated successfully!
            </div>
          )}


          <div className="w-28 h-28 rounded-full overflow-hidden border border-blue-400">
            <img
              src={image || "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          {editMode && (
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-sm text-blue-600 hover:underline"
              >
                Change Photo
              </button>
              {image && (
                <button
                  onClick={handleRemoveImage}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          )}


        </div>

        <div className="space-y-6 text-sm text-black">
          {/* Name */}
          <div className="flex items-center gap-3">
            <User size={18} className="text-blue-700" />
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border-b border-blue-300 focus:border-blue-600 outline-none bg-transparent text-black"
              />
            ) : (
              <p className="text-black">{formData.name || "Full Name not set"}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-blue-700" />
            {editMode ? (
              <PhoneInput
                country={'in'}
                value={String(formData.phone || '').replace('+', '')
                }
                onChange={(phone) => setFormData({ ...formData, phone: `+${phone}` })}
                inputProps={{
                  name: 'phone',
                  required: true,
                }}
                inputClass="!w-full !border-b !border-blue-300 !focus:border-blue-600 !outline-none !bg-transparent !text-black"
                containerClass="!bg-transparent"
              />
            ) : (
              <p className="text-black">{formData.phone || "Phone not set"}</p>
            )}
          </div>


          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-blue-700" />
            <p className="text-black">{user.email}</p>
          </div>

          {/* Bio */}
          <div className="flex items-start gap-3">
            <Edit3 size={18} className="text-blue-700 mt-1" />
            {editMode ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={3}
                className="w-full border-b border-blue-300 focus:border-blue-600 outline-none bg-transparent text-black resize-none"
              />
            ) : (
              <p className="text-black">{formData.bio || "No bio provided"}</p>
            )}
          </div>
          <button
            onClick={handleLogOut}
            className="text-red-400 flex items-center hover:text-red-600 gap-2 cursor-pointer ">
            <span className="text-lg">Logout</span><LogOut size={14} />
          </button>
        </div>

        {editMode && (
          <div className="text-right mt-8">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${uploading
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default Profile;
