import { getProjectById } from "../lib/localDB/projectDB";
import { useEditorStore } from "../stores/editorStore";
import { getUser } from "./useAuth";
export const useProjectHandler = () => {
  const { setImagesWithUrls } = useEditorStore();

  const handleProjectImages = async (projectId) => {
    if (!projectId) {
      console.warn("No project ID provided");
      return [];
    }

    try {
      const loggedUser = await getUser();
      const project = await getProjectById(projectId, loggedUser.id);

      if (!project) {
        console.warn("Project not found");
        return [];
      }

      const updatedImages = project.images.map((image, index) => ({
        src: URL.createObjectURL(
          new Blob([image.image], { type: "image/webp" })
        ),
        index: index,
      }));

      setImagesWithUrls(updatedImages);
      return updatedImages;
    } catch (error) {
      console.error("Error handling project images:", error);
      return [];
    }
  };

  return { handleProjectImages };
};
