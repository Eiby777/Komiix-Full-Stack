import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveModel } from "../../lib/localDB/modelDB";
import LoadingModal from "./LoadingModal";
import { supabase } from "../../lib/supabaseClient";
import domain from "../../hooks/domain";

const BASE_URL = domain + '/api';

const MODEL_ENDPOINTS = {
  globes: `${BASE_URL}/get-globes`,
  text: `${BASE_URL}/get-text`,
  inpainting: `${BASE_URL}/get-inpainting`,
};

const ModelDownloader = ({ modelName, onComplete, version, setModelStatus, isFragmented, filename }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const downloadModel = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const accesToken = session.access_token;
      try {
        if (isFragmented) {
          const metadataResponse = await fetch(`${BASE_URL}/get-model-fragments/${modelName}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accesToken}`
            }
          });
          if (!metadataResponse.ok) {
            const errorText = await metadataResponse.text();
            throw new Error(`Error obteniendo metadatos: ${metadataResponse.status} - ${errorText}`);
          }
          const { fragment_names, encrypted_fragment_index, session_key } = await metadataResponse.json();

          const keyResponse = await fetch(`${BASE_URL}/get-encryption-key/${session_key}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/octet-stream",
              "Authorization": `Bearer ${accesToken}`
            }
          });
          if (!keyResponse.ok) {
            const errorText = await keyResponse.text();
            throw new Error(`Error obteniendo clave: ${keyResponse.status} - ${errorText}`);
          }
          const encryptionKey = await keyResponse.arrayBuffer();

          const fragments = [];
          for (let i = 0; i < fragment_names.length; i++) {
            const fragmentName = fragment_names[i];
            const fragmentResponse = await fetch(`${BASE_URL}/get-fragment/${modelName}/${fragmentName}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accesToken}`
              }
            });
            if (!fragmentResponse.ok) {
              const errorText = await fragmentResponse.text();
              throw new Error(`Error descargando fragmento ${fragmentName}: ${fragmentResponse.status} - ${errorText}`);
            }
            const fragmentData = await fragmentResponse.arrayBuffer();
            if (fragmentData.byteLength === 0) {
              throw new Error(`Fragmento ${fragmentName} (index ${i}) tiene longitud 0, lo cual es inválido`);
            }
            fragments.push(fragmentData);
            setProgress(((i + 1) / fragment_names.length) * 100);
          }

          const modelData = {
            fragments,
            fragment_names,
            encrypted_fragment_index,
            encryption_key: encryptionKey,
            isFragmented: true,
          };
          await saveModel(modelName, modelData, version);
          onComplete(modelName, modelData, version, setModelStatus);
        } else {
          const response = await fetch(MODEL_ENDPOINTS[modelName], {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "Authorization": `Bearer ${accesToken}`
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const zipBlob = await response.blob();
          const zip = await JSZip.loadAsync(zipBlob);
          const modelData = await zip.file(filename).async("arrayBuffer");
          const modelDataObj = {
            data: modelData,
            isFragmented: false,
          };
          await saveModel(modelName, modelDataObj, version);
          onComplete(modelName, modelDataObj, version, setModelStatus);
        }
      } catch (err) {
        console.error(`Error descargando ${modelName}:`, err);
        setError(`Error al descargar ${modelName}: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    downloadModel();
  }, [modelName, onComplete, version, setModelStatus, isFragmented, filename]);

  return (
    <>
      {isLoading && (
        <LoadingModal
          title="Actualizando Modelo"
          message={
            isFragmented
              ? `Descargando fragmentos del modelo de ${
                  modelName === "globes" || modelName === "text" ? "detección" : "redibujo"
                }... Progreso: ${Math.round(progress)}%`
              : `Descargando el modelo de ${
                  modelName === "globes" || modelName === "text" ? "detección" : "redibujo"
                }...`
          }
        />
      )}
      {error && console.warn(error)}
    </>
  );
};

export default ModelDownloader;