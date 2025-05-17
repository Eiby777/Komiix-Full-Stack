import createRectangleObject from '../../tools/components/ANNOTATION/rectangle/createRectangleObject';
import { createImageObject } from '../../tools/components/CLEANUP/brush/TemplateBrush';
import { configTextObject } from '../../tools/components/TYPE/text/handlers/textObjectHandlers';
import { LAYERS } from '../../../../constants/layers';
import { fetchFontFile } from '../../../../hooks/fontApi';

/**
 * Recalculates the positions of objects on the canvas after resizing the container.
 */
const recalculateObjectPositions = (parentDimensions, { currentWidth, currentHeight, object }) => {
    const oldParentWidth = parentDimensions?.width ?? currentWidth;
    const oldParentHeight = parentDimensions?.height ?? currentHeight;
    const backgroundObj = { left: oldParentWidth / 2, top: oldParentHeight / 2, width: object.width, height: object.height };
    const relativeLeft = (object.left - backgroundObj.left) / backgroundObj.width;
    const relativeTop = (object.top - backgroundObj.top) / backgroundObj.height;
    const newLeft = (currentWidth / 2) + relativeLeft * backgroundObj.width;
    const newTop = (currentHeight / 2) + relativeTop * backgroundObj.height;
    return { newLeft, newTop };
};

/**
 * Creates an object on the canvas with recalculated dimensions and position.
 */
const handleCreateObject = (item, object, canvas, currentWidth, currentHeight, activeLayer) => {
    const { newLeft, newTop } = recalculateObjectPositions(item.parentDimensions, { currentWidth, currentHeight, object });
    if (object.type === 'Rect') {
        const obj = createRectangleObject(newLeft, newTop, object.stroke, object.width, object.height);
        if (activeLayer !== LAYERS.ANNOTATION.id) {
            obj.set({ opacity: 0, selectable: false, evented: false });
        }
        obj.id = object.id;
        canvas.add(obj);
    } else if (object.type === 'Image') {
        object.left = newLeft;
        object.top = newTop;
        createImageObject(object, object.layer).then((image) => {
            if (activeLayer === LAYERS.ORIGINAL.id || activeLayer === LAYERS.ANNOTATION.id) {
                image.set({ opacity: 0, selectable: false, evented: false });
            }
            else{
                image.set({ opacity: 1, selectable: false, evented: false });
            }
            image.id = object.id;
            canvas.add(image);
        });
    } else if (object.type === 'Textbox') {
        const obj = configTextObject(
            {
                left: newLeft,
                top: newTop,
                width: object.width,
                height: object.height
            },
            canvas,
            object.fill,
            object.id,
            object
        );
        obj.set({
            text: object.text,
            originalText: object.originalText,
            translatedText: object.translatedText,
            typeText: object.typeText,
            angle: object.angle
        });
        if (activeLayer !== LAYERS.TEXT.id && activeLayer !== LAYERS.OUTPUT.id) {
            obj.set({ opacity: 0, selectable: false, evented: false });
        }else{
            obj.set({ opacity: 1, selectable: true, evented: true });
            console.log("Object added to canvas:", obj);
        }
        canvas.add(obj);
        canvas.renderAll();
    }
};

/**
 * Gets the dimensions of the parent container.
 */
const getParentContainerDimensions = () => {
    const parentContainer = document.getElementById("div_canvases");
    return {
        width: parentContainer.clientWidth,
        height: parentContainer.clientHeight
    };
};

/**
 * Extracts unique font families from the project data and loads them.
 */
const loadProjectFonts = async (data) => {
    const fontsToNotLoad = ['Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];
    // Extract unique font families from all Textbox objects in the project data
    const fontSet = new Set();
    data.forEach(item => {
        const objects = item.data.objects || [];
        objects.forEach(obj => {
            if (obj.type === 'Textbox' && obj.fontFamily && !fontsToNotLoad.includes(obj.fontFamily)) {
                fontSet.add(obj.fontFamily);
            }
        });
    });

    const fontsToLoad = Array.from(fontSet);
    const loadPromises = fontsToLoad.map(async (fontName) => {
        try {
            const fontData = await fetchFontFile(fontName);
            const fontBlob = new Blob([fontData], { type: 'font/woff2' });
            const fontUrl = URL.createObjectURL(fontBlob);
            
            // Create dynamic @font-face rule
            const fontFace = `
                @font-face {
                    font-family: "${fontName}";
                    src: url(${fontUrl}) format('woff2');
                }
            `;
            
            // Add the font-face to the document
            const styleSheet = document.createElement('style');
            styleSheet.textContent = fontFace;
            document.head.appendChild(styleSheet);
            
            // Wait for the font to load
            await document.fonts.load(`16px "${fontName}"`);
        } catch (error) {
            console.error(`Error loading font ${fontName}:`, error);
        }
    });

    await Promise.all(loadPromises);
};

/**
 * Processes and renders the data on the canvases.
 */
const processCanvasData = async (
    data,
    canvasInstances,
    activeLayer,
    setCanvasObjectStatus,
    width,
    height,
    setShowLoadModal
) => {
    data.forEach(async (item, index) => {
        const canvas = canvasInstances[index];
        const objects = item.data.objects;
        objects.forEach(async (object) => {
            await handleCreateObject(item, object, canvas, width, height, activeLayer);
        });

        canvas.discardActiveObject();
        canvas.renderAll();
        setCanvasObjectStatus(index, objects.length > 0);
    });

    setShowLoadModal(false);
};

/**
 * Handles the loading of project data, ensuring fonts are loaded first.
 */
const handleLoadImportedFile = async (
    file,
    canvasInstances,
    setShowLoadModal,
    activeLayer,
    setCanvasObjectStatus
) => {
    const processData = async (data) => {
        // Load all fonts before processing the canvas data
        await loadProjectFonts(data);
        
        const { width, height } = getParentContainerDimensions();
        processCanvasData(
            data,
            canvasInstances,
            activeLayer,
            setCanvasObjectStatus,
            width,
            height,
            setShowLoadModal
        );
    };

    if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let data = null;
            try {
                data = JSON.parse(e.target.result);
            } catch (error) {
                console.error('Error al cargar datos de fabric:', error);
                return;
            }
            if (data) {
                processData(data);
            }
        };
        reader.onerror = (error) => {
            console.error('Error al leer el archivo:', error);
        };
        reader.readAsText(file);
    } else if (file) {
        processData(file);
    }
};

export default handleLoadImportedFile;