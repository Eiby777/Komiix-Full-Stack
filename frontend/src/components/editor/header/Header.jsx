import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../../stores/editorStore';
import ProgressBar from './Components/ProgressBar';
import ActionButtons from './Components/ActionButtons';
import LoadModal from './Components/LoadModal';
import handleLoadImportedFile from './handlers/handleFileUpload';
import { updateProject, getProjectById } from '../../../lib/localDB/projectDB';
import { useParams } from 'react-router-dom';
import { getUser } from '../../../hooks/useAuth';


export default function Header() {
  const headerRef = useRef(null);


  useEffect(() => {
    const calculateHeaderHeight = () => {
      const windowHeight = window.innerHeight;
      const referenceHeight = 976;
      const referenceHeaderHeight = 75;

      const height = Math.min(
        Math.round((windowHeight / referenceHeight) * referenceHeaderHeight),
        100
      );
      if (height < 46) {
        setHeaderHeight('46px');
      } else {
        setHeaderHeight(`${height}px`);
      }
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);
  const {
    imagesLoaded,
    setCanvasObjectStatus,
    activeImageIndex,
    setActiveImageIndex,
    images,
    canvasInstances,
    activeLayer,
    setHeaderHeight,
    headerHeight
  } = useEditorStore();
  const [isLoadingImage, _] = useState(false);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(String(activeImageIndex + 1));
  const [totalItems, setTotalItems] = useState(images?.length ?? 0);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const { projectId } = useParams();
  const hasInitialLoad = useRef(false);

  useEffect(() => {
    if (!projectId) return;
  }, [projectId]);

  useEffect(() => {
    setInputValue(String(activeImageIndex + 1));
    setTotalItems(images?.length ?? 0);
  }, [activeImageIndex, images]);

  useEffect(() => {
    if (!canvasInstances?.length || !imagesLoaded) return;
    handleLoad();
  }, [canvasInstances, projectId, imagesLoaded]);

  const handlePrevious = () => {
    if (activeImageIndex > 0 && !isLoadingImage) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeImageIndex < (images?.length ?? 0) - 1 && !isLoadingImage) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };

  const handleJump = (index) => {
    if (index >= 0 && index < (images?.length ?? 0) && !isLoadingImage) {
      setActiveImageIndex(index);
    }
  };

  const handleLoad = async (file = null) => {
    const user = await getUser();
    if (!file) {
      if (!hasInitialLoad.current) {
        hasInitialLoad.current = true;
        const project = await getProjectById(projectId, user.id);
        if (project) {
          handleLoadImportedFile(project, canvasInstances, setShowLoadModal, activeLayer, setCanvasObjectStatus);
        }
      }
      return;
    }
    handleLoadImportedFile(file, canvasInstances, setShowLoadModal, activeLayer, setCanvasObjectStatus);
  };

  const save = async () => {
    const handleCloneCanvases = async () => {
      const clonePromises = canvasInstances.map((canvas) => canvas.clone());
      const cloneCanvases = await Promise.all(clonePromises);

      cloneCanvases.forEach((cloneCanvas, index) => {
        const clonedObjects = cloneCanvas.getObjects();
        const originalObjects = canvasInstances[index].getObjects();
        const backgroundObjectIndex = originalObjects.findIndex(object => object.backgroundImage);

        if (backgroundObjectIndex !== -1) {
          const backgroundObject = clonedObjects[backgroundObjectIndex];
          cloneCanvas.remove(backgroundObject);
        }
        cloneCanvas.requestRenderAll();
      });
      return cloneCanvases;
    };

    const extractUsedFontIds = () => {
      const usedFontIds = new Set();
      canvasInstances.forEach((canvas) => {
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          if (obj.type === 'textbox' && obj.fontId) {
            usedFontIds.add(obj.fontId);
          }
        });
      });
      return Array.from(usedFontIds);
    };

    const addIds = (canvases) => {
      canvases.forEach((canvas, canvasIndex) => {
        const currentCanvasObjects = canvasInstances[canvasIndex].getObjects();
        const canvasObjects = canvas.data.objects;
        canvasObjects.forEach((object, objectIndex) => {
          object.id = currentCanvasObjects[(objectIndex + 1)]?.id ?? null;
          object.layer = currentCanvasObjects[(objectIndex + 1)]?.layer ?? null;
          object.angle = currentCanvasObjects[(objectIndex + 1)]?.angle ?? null;
          object.originalText = currentCanvasObjects[(objectIndex + 1)]?.originalText ?? null;
          object.translatedText = currentCanvasObjects[(objectIndex + 1)]?.translatedText ?? null;
          object.typeText = currentCanvasObjects[(objectIndex + 1)]?.typeText ?? null;
          object.fontId = currentCanvasObjects[(objectIndex + 1)]?.fontId ?? null;
        });
      });

      return canvases;
    };

    const cloneCanvases = await handleCloneCanvases();

    const parentContainer = document.getElementById("div_canvases");
    const parentWidth = parentContainer.clientWidth;
    const parentHeight = parentContainer.clientHeight;

    const canvasInstancesData = cloneCanvases.map((canvas) => ({
      data: canvas.toJSON(),
      parentDimensions: { width: parentWidth, height: parentHeight }
    }));

    const canvasInstancesDataWithIds = addIds(canvasInstancesData);
    const usedFonts = extractUsedFontIds();

    // Return both canvas data and used fonts
    return { canvasData: canvasInstancesDataWithIds, usedFonts };
  };

  const handleSaveLocal = async () => {
    const { canvasData, usedFonts } = await save();
    const user = await getUser();
    await updateProject(projectId, user.id, {
      savefile: canvasData,
      usedFonts: usedFonts,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleExport = async () => {
    const { canvasData, usedFonts } = await save();

    const exportData = {
      canvasData: canvasData,
      usedFonts: usedFonts,
      exportedAt: new Date().toISOString()
    };

    const a = document.createElement('a');
    const data = JSON.stringify(exportData);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date();
    const dateString = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getFullYear().toString().slice(-2)}`;
    a.href = url;
    a.download = `Komiix-${dateString}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-shrink-0 flex">
      <div ref={headerRef} className="w-full bg-[#1a1a1a] border-b border-white/20 fixed top-0 right-0 z-[100] ml-[60px] overflow-hidden" style={{ height: headerHeight }}>
        <div className="w-full px-8 flex items-center justify-between h-full">
          <ProgressBar
            activeImageIndex={activeImageIndex}
            totalItems={totalItems}
            isLoadingImage={isLoadingImage}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleJump={handleJump}
            headerHeight={headerHeight}
          />
          <ActionButtons
            navigate={navigate}
            handleExport={handleExport}
            handleSaveLocal={handleSaveLocal}
            setShowLoadModal={setShowLoadModal}
            headerHeight={headerHeight}
          />
        </div>
        <LoadModal
          showLoadModal={showLoadModal}
          setShowLoadModal={setShowLoadModal}
          handleLoad={handleLoad}
        />
      </div>
    </div>
  );
}