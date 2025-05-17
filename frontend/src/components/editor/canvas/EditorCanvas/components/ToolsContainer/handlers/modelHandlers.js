import { checkModel, updateModel } from "../../../../../../../lib/localDB/modelDB";
import { TOOLS } from "../../../../../../../constants/tools";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "../../../../../../../lib/supabaseClient";
import domain from "../../../../../../../hooks/domain";

const TOOL_MODELS = {
  [TOOLS.SCAN.id]: ['globes', 'text'],
  [TOOLS.REDRAW.id]: ['inpainting']
};

const handleModelComplete = (modelName, modelData, version, setModelStatus) => {
  setModelStatus((prev) => ({
    ...prev,
    [modelName]: { isReady: true, version, data: modelData, readyToDownload: false }
  }));
};

const areToolModelsReady = (toolId, modelStatus) => {
  const requiredModels = TOOL_MODELS[toolId] || [];
  return requiredModels.every((modelName) => modelStatus[modelName].isReady);
};

const getRequiredModels = (activeTools) => {
  const models = new Set();
  activeTools.forEach((toolId) => {
    if (TOOL_MODELS[toolId]) {
      TOOL_MODELS[toolId].forEach((model) => models.add(model));
    }
  });
  return Array.from(models);
};

const handleCheckModel = async (modelName, newStatus) => {
  const cachedModel = await checkModel(modelName);
  let updatedStatus = newStatus[modelName];
  if (cachedModel) {
    newStatus[modelName] = {
      isReady: true,
      version: cachedModel.version
    };
    updatedStatus = newStatus[modelName];
    return { updatedStatus, cachedModel };
  }
  return { updatedStatus, cachedModel };
};

const checkIfModelIsUpdated = async (modelName) => {
  const { data: { session } } = await supabase.auth.getSession();
  const accesToken = session.access_token;
  const response = await fetch(`${domain}/api/model-version/${modelName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accesToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error HTTP (version ${modelName}): ${response.status}`);
  }
  const responseData = await response.json();
  const { version: serverVersion, original_filename: filename, is_fragmented } = responseData;
  return { serverVersion, filename, is_fragmented };
};

const handleUpdateModelStatus = (
  cachedModel,
  serverVersion,
  filename,
  newStatus,
  modelName
) => {
  const newToken = uuidv4();
  if (!cachedModel || cachedModel.version !== serverVersion) {
    newStatus[modelName].isReady = false;
    newStatus[modelName].readyToDownload = true;
    newStatus[modelName].filename = filename;
    newStatus[modelName].version = serverVersion;

    if (cachedModel) {
      updateModel(modelName, {
        version: serverVersion,
        token: newToken,
        tokenExpiration: Date.now() + 24 * 60 * 60 * 1000
      });
    }
    return newStatus[modelName];
  }

  if (cachedModel) {
    updateModel(modelName, {
      token: newToken,
      tokenExpiration: Date.now() + 24 * 60 * 60 * 1000
    });
  }
  return newStatus[modelName];
};

export {
  getRequiredModels,
  areToolModelsReady,
  handleModelComplete,
  handleCheckModel,
  checkIfModelIsUpdated,
  handleUpdateModelStatus
};