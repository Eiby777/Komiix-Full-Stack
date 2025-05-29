import WorkPlace from "../components/editor/WorkPlace";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEditorStore } from "../stores/editorStore";
import EditorCanvas from "../components/editor/canvas/EditorCanvas";
import LayersPanel from "../components/editor/floating-menus/Layers";
import SettingsPanel from "../components/editor/settings/SettingsPanel";
import Header from "../components/editor/header/Header";
import ZoomControls from "../components/editor/floating-menus/ZoomControls";
import ToolsSideBar from "../components/editor/toolbar/Toolbar";
import UndoRedoMenu from "../components/editor/floating-menus/UndoRedoMenu/UndoRedoMenu";
import { useProjectHandler } from "../hooks/getProjects";

export default function Editor() {
  const {
    setActiveImageIndex,
    imagesLoaded,
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
      <WorkPlace
        header={<Header />}
        toolbar={<ToolsSideBar />}
        canvas={<EditorCanvas />}
        settingsPanel={<SettingsPanel />}
        zoomControls={imagesLoaded && <ZoomControls />}
        layerPanel={imagesLoaded && <LayersPanel/>}
        undoRedoMenu={imagesLoaded && <UndoRedoMenu />}
      />
    </>
  );
}
