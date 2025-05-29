import WorkPlace from "../components/editor/WorkPlace";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEditorStore } from "../stores/editorStore";
import { useProjectHandler } from "../hooks/getProjects";

export default function Editor() {
  const {
    setActiveImageIndex,
    images,
    setImages
  } = useEditorStore();
  const { projectId } = useParams();
  const { handleProjectImages } = useProjectHandler(null);

  useEffect(() => {
    const checkImages = async () => {
      if (images.length === 0) {
        try {
          const images = await handleProjectImages(projectId);
          if (images && images.length > 0) {
            setImages(images);
            setActiveImageIndex(0);
          }
        } catch (error) {
          console.error("Error editing project:", error);
        }
      }
    };
  
    checkImages();   
  }, []);
  
  useEffect(() => {
    const preventBrowserZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", preventBrowserZoom, { passive: false });
    return () => {
      document.removeEventListener("wheel", preventBrowserZoom);
    };
  }, []);
  
  return (
    <>
      <WorkPlace />
    </>
  );
}
