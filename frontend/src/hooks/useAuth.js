import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { getLocalProfile } from "../lib/localDB/profileDB";
import defaultProfile from "../components/dashbboard/header/images/defaultProfile717.webp";

let user = null;

export async function getUser() {
  if (!user) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }
  return user;
}


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    picture: defaultProfile,
    username: "User",
  });

  const fetchUserProfile = async () => {
    const handleUserNotFound = () => {
      setIsAuthenticated(false);
      setIsLoading(false);
    };

    const setProfileFromLocal = async (userId) => {
      const localProfile = await getLocalProfile(userId);
      
      if (!localProfile) return;

      if (localProfile.profilePicture) {
        const arrayBuffer = localProfile.profilePicture;
        const blob = new Blob([arrayBuffer], { type: "image/webp" });
        const imageUrl = URL.createObjectURL(blob);
        setProfile({
          picture: imageUrl,
          username: localProfile.userName || profile.username,
        });
        return;
      }
      
      setProfile({
        picture: defaultProfile,
        username: localProfile.userName || profile.username,
      });

    };

    try {
      const loggedUser = await getUser();

      if (!loggedUser) {
        handleUserNotFound();
        return;
      }

      setIsAuthenticated(true);
      await setProfileFromLocal(loggedUser.id);

    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAuthenticated(false);
      window.location.reload();
    } else {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    profile,
    setProfile,
    handleLogout,
  };
}
