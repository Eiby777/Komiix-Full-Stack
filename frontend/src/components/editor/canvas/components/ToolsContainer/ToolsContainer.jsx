import { useEditorStore } from "../../../../../stores/editorStore";
import { TOOLS } from "../../../../../constants/tools";
import {
  RectangleTool,
  PlusTool,
  ScanTool,
  BrushTool,
  EraserTool,
  CloneTool,
  RedrawTool,
  TextTool,
  AutoCleanTool,
  OriginalViewTool,
  AdjustTextTool,
  TextScanTool,
  ExportTool
} from "../../../tools/components";
import ExportTextTool from "../../../tools/components/TYPE/export_text";
import { supabase } from "../../../../../lib/supabaseClient";
import { memo, useState, useEffect } from "react";
import { checkModel, deleteAllModels } from "../../../../../lib/localDB/modelDB";
import ModelDownloader from "../../../../../pages/ModelDownloader/ModelDownloader";
import { getRequiredModels, areToolModelsReady, handleModelComplete, checkIfModelIsUpdated, handleCheckModel, handleUpdateModelStatus } from "./handlers/modelHandlers";

//deleteAllModels();

const ToolsContainer = memo(({ currentImageIndex }) => {
  const { activeTools} = useEditorStore();
  const [modelStatus, setModelStatus] = useState({
    globes: { isReady: false, version: null, readyToDownload: null, filename: null, isFragmented: false },
    text: { isReady: false, version: null, readyToDownload: null, filename: null, isFragmented: false },
    inpainting: { isReady: false, version: null, readyToDownload: null, filename: null, isFragmented: false }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accesToken = session.access_token;
      console.log(accesToken);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const includesModelTools = activeTools.includes(TOOLS.SCAN.id) || activeTools.includes(TOOLS.REDRAW.id);
    if (!includesModelTools) {
      return;
    }
    const checkModels = async () => {
      const modelsToCheck = getRequiredModels(activeTools);
      if (modelsToCheck.length === 0) return;

      const newStatus = { ...modelStatus };
      for (const modelName of modelsToCheck) {
        try {
          if (newStatus[modelName].isReady) continue;

          const { updatedStatus, cachedModel } = await handleCheckModel(modelName, newStatus);
          newStatus[modelName] = updatedStatus;

          const modelExists = !!cachedModel;
          const isTokenValid = cachedModel && typeof cachedModel.token === 'string' && cachedModel.token && cachedModel.tokenExpiration > Date.now();

          if (modelExists && isTokenValid) {
            console.warn(`Skipping server check for ${modelName}: valid token`);
            continue;
          }

          try {
            const { serverVersion, filename, is_fragmented } = await checkIfModelIsUpdated(modelName);
            newStatus[modelName] = handleUpdateModelStatus(
              cachedModel,
              serverVersion,
              filename,
              newStatus,
              modelName
            );
            newStatus[modelName].isFragmented = is_fragmented;
          } catch (err) {
            console.warn(`Error al verificar ${modelName} en servidor:`, err);
            newStatus[modelName].error = `Error al verificar ${modelName} en servidor: ${err.message}`;
          }
        } catch (err) {
          console.warn(`Error al verificar ${modelName} en local:`, err);
          newStatus[modelName].error = `Error al verificar ${modelName} en local: ${err.message}`;
        }
      }

      setModelStatus(newStatus);
    };

    checkModels();
  }, [activeTools]);

  return (
    <>
      {(activeTools.includes(TOOLS.SCAN.id) || activeTools.includes(TOOLS.REDRAW.id)) && (
        Object.entries(modelStatus).map(([modelName, { readyToDownload, version, isFragmented, filename }]) => (
          readyToDownload && getRequiredModels(activeTools).includes(modelName) && (
            <ModelDownloader
              key={modelName}
              modelName={modelName}
              onComplete={handleModelComplete}
              version={version}
              setModelStatus={setModelStatus}
              isFragmented={isFragmented}
              filename={filename}
            />
          )
        ))
      )}
      {error && console.warn(error)}
      {activeTools.includes(TOOLS.PLUS.id) && <PlusTool />}
      {activeTools.includes(TOOLS.RECTANGLE.id) && (
        <RectangleTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.SCAN.id) && (
        areToolModelsReady(TOOLS.SCAN.id, modelStatus) && <ScanTool />
      )}
      {activeTools.includes(TOOLS.BRUSH.id) && (
        <BrushTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.ERASER.id) && (
        <EraserTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.CLONE.id) && (
        <CloneTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.REDRAW.id) && (
        areToolModelsReady(TOOLS.REDRAW.id, modelStatus) && <RedrawTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.AUTO_CLEAN.id) && <AutoCleanTool />}
      {activeTools.includes(TOOLS.TEXT.id) && (
        <TextTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.ORIGINAL_VIEW.id) && (
        <OriginalViewTool />
      )}
      {activeTools.includes(TOOLS.ADJUST_TEXT.id) && (
        <AdjustTextTool currentImageIndex={currentImageIndex} />
      )}
      {activeTools.includes(TOOLS.TEXT_SCAN.id) && (
        <TextScanTool />
      )}
      {activeTools.includes(TOOLS.EXPORT.id) && (
        <ExportTool />
      )}
      {activeTools.includes(TOOLS.EXPORT_TEXT.id) && (
        <ExportTextTool />
      )}
    </>
  );
});

ToolsContainer.displayName = "ToolsContainer";

export default ToolsContainer;