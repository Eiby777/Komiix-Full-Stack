import { useEffect } from 'react';
import { useEditorStore } from '../../../../../../stores/editorStore';
import { LAYERS } from '../../../../../../constants/layers';

const OriginalViewTool = () => {
    const { canvasInstances, activeImageIndex } = useEditorStore();

    useEffect(() => {
        canvasInstances[activeImageIndex].getObjects().forEach((object) => {
            if (object.layer === LAYERS.TEXT.id || object.layer === LAYERS.CLEANUP.id) {
                object.opacity = 0;
                canvasInstances[activeImageIndex].requestRenderAll();
            }
        });
        
        return () => {
            canvasInstances[activeImageIndex].getObjects().forEach((object) => {
                if (object.layer === LAYERS.TEXT.id || object.layer === LAYERS.CLEANUP.id) {
                    object.opacity = 1;
                    canvasInstances[activeImageIndex].requestRenderAll();
                }
            });
        };
    }, [canvasInstances, activeImageIndex]);

    return null;
};

export default OriginalViewTool;
