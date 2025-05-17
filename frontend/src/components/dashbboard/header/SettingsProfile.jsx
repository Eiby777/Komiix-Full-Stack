import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { getUser } from '../../../hooks/useAuth';


export default function SettingsProfile({ onClose, initialProfile, onSave }) {
  const [profile, setProfile] = useState(initialProfile);
  const [usernameError, setUsernameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [dataprofile, setDataprofile] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setDataprofile((prev) => ({ ...prev, [name]: value }))
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === 'username' && usernameError) {
      setUsernameError('');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataprofile((prev) => ({ ...prev, picture: file }))
      setProfile((prev) => ({ ...prev, picture: URL.createObjectURL(file) }));
    }
  };

  const validateUsername = async () => {
    if (!profile.username || profile.username === initialProfile.username) return true;

    const user = await getUser()
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('username', profile.username)
      .neq('id', user.id);

    if (error) {
      console.error('Username validation error:', error);
      setUsernameError('Error checking username availability');
      return false;
    }

    if (count > 0) {
      setUsernameError('Username is already taken');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!profile.username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    const isValid = await validateUsername();
    if (!isValid) return;

    setIsSaving(true);
    try {
      await onSave(dataprofile);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
      setUsernameError('Failed to save profile changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all duration-200 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative w-28 h-28 mb-4 group">
              <img
                src={profile.picture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-200"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  id="profile-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>

            {/* Username Input */}
            <div className="w-full">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${
                  usernameError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500'
                } focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="Enter your username"
              />
              {usernameError && (
                <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mt-2">
                  {usernameError}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
