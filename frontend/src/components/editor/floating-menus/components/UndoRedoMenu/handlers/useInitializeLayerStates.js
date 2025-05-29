import { useEffect } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';

const useInitializeLayerStates = () => {
  const { canvasInstances, setLayerState, setLayerRedoState, layersToInitialize } = useEditorStore();
  
  useEffect(() => {
    const canvases = canvasInstances;
    if (!canvases?.length) return;

    canvases.forEach((canvas, imageIndex) => {
      if (!canvas) return;
      
      const initialState = canvas.toJSON().objects.map((obj) => obj.type);
      layersToInitialize.forEach((layer) => {
        setLayerState(layer, imageIndex, initialState);
        setLayerRedoState(layer, imageIndex, []);
      });
    });
  }, [canvasInstances]);
};

export default useInitializeLayerStates;
