import { useState, useEffect, useRef } from "react";
import {
  convertToWebpLossless,
} from "../lib/projects";
import {
  getProjects,
} from "../lib/localDB/projectDB";
import { getUser, useAuth } from "./useAuth";
import {
  getLocalUser,
  saveUser,
} from "../lib/localDB/userDB";
import {
  updateLocalProfile,
  getLocalProfile,
  saveLocalProfile,
} from "../lib/localDB/profileDB";
import { useEditorStore } from "../stores/editorStore";

export function useDashboard() {
  const { profile, setProfile } = useAuth();
  const { projects, setProjects } = useEditorStore();
  const { setIsSidebarCollapsed } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [projectName, setProjectName] = useState("");
  const profileMenuRef = useRef(null);
  let hasLoaded = false;
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getLocalProjects = async (userId) => {
      try {
        const currentProjects = await getProjects(userId);
        const formattedProjects = currentProjects.map((project) => ({
          id: project.id,
          name: project.name,
          last_updated: new Intl.DateTimeFormat("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
          banner: URL.createObjectURL(new Blob([project.banner], { type: "image/webp" })),
          status: project.status || "Pendiente",
        }));
        return formattedProjects;
      } catch (error) {
        console.error("Error getting projects:", error);
        return [];
      }
    };

    const loadLocalProjects = async () => {
      const loggedUser = await getUser();
      const localProjects = await getLocalProjects(loggedUser.id);
      return localProjects;
    };

    const loadData = async () => {
      setIsLoading(true);
      try {
        const loggedUser = await getUser();
        const localUser = await getLocalUser(loggedUser.id);
        if (!localUser) {
          await saveUser(loggedUser.id);
        }

        const localProjects = await loadLocalProjects(loggedUser.id);
        if (localProjects.length > 0) {
          if (JSON.stringify(projects) !== JSON.stringify(localProjects)) {
            setProjects(localProjects);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!hasLoaded) {
      hasLoaded = true;
      loadData();
    }
  }, []);



  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const globalProfile = await getUser();
      let localParams = {};

      if (updatedProfile.username) {
        localParams.userName = updatedProfile.username;
      }

      if (updatedProfile.picture && !updatedProfile.picture.name.includes("defaultProfile717.webp")) {
        const pictureToWebp = await convertToWebpLossless(updatedProfile.picture);
        const arrayBuffer = await pictureToWebp.arrayBuffer();
        localParams.profilePicture = arrayBuffer;
      }

      const localProfile = await getLocalProfile(globalProfile.id);
      if (!localProfile) {
        await saveLocalProfile(
          globalProfile.id,
          localParams.userName,
          localParams.profilePicture
        );
      } else {
        await updateLocalProfile(globalProfile.id, localParams);
      }
      
      setProfile({
        username: localParams.userName || profile.username,
        picture: localParams.profilePicture
          ? URL.createObjectURL(
            new Blob([localParams.profilePicture], { type: "image/webp" })
          )
          : profile.picture,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Efecto para manejar el estado del sidebar en base al tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      // Si la pantalla es >=768px (md), asegurar que el sidebar esté visible
      if (window.innerWidth >= 768) {
        setIsSidebarCollapsed(false);
      }
    };

    // Ejecutar al montar
    handleResize();

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isDragging,
    setIsDragging,
    projectName,
    setProjectName,
    profile,
    handleUpdateProfile,
    profileMenuRef,
    isLoading
  };
}
