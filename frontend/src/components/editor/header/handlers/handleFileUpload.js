import createRectangleObject from '../../tools/components/ANNOTATION/rectangle/createRectangleObject';
import { createImageObject } from '../../tools/components/CLEANUP/brush/TemplateBrush';
import { configTextObject } from '../../tools/components/TYPE/text/handlers/textObjectHandlers';
import { LAYERS } from '../../../../constants/layers';
import { getFontUrl } from '../../../../hooks/fontApi';

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

        // Set fontId - this is the primary identifier
        if (object.fontId) {
            obj.set('fontId', object.fontId);
            console.log('Setting fontId for object:', object.fontId);
        }

        // Set fontFamily for display only - derived from fontId when needed
        if (object.fontFamily) {
            // Escape font name for CSS if it contains special characters
            const escapedFontName = object.fontFamily.includes(' ') || object.fontFamily.includes('!') || object.fontFamily.includes('\'')
                ? `'${object.fontFamily.replace(/'/g, "\\'")}'`
                : object.fontFamily;
            obj.set('fontFamily', escapedFontName);

        }

        if (activeLayer !== LAYERS.TEXT.id && activeLayer !== LAYERS.OUTPUT.id) {
            obj.set({ opacity: 0, selectable: false, evented: false });
        }else{
            obj.set({ opacity: 1, selectable: true, evented: true });
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
 * Loads fonts by their IDs for project loading - ID-based management only.
 */
const loadProjectFonts = async (usedFontIds = []) => {
    if (!usedFontIds || usedFontIds.length === 0) {
        console.log('No font IDs to load for this project');
        return;
    }

    console.log('Loading fonts by IDs:', usedFontIds);

    try {
        // Get font list to map IDs to names
        const { fetchFontList } = await import('../../../../hooks/fontApi');
        const fontList = await fetchFontList();

        const loadPromises = usedFontIds.map(async (fontId) => {
            try {
                // Find font info by ID only
                const fontInfo = fontList.find(font => font.id === fontId);
                if (!fontInfo) {
                    console.warn(`Font ID ${fontId} not found in font list, skipping`);
                    return;
                }

                // Check if font is already loaded by ID
                const existingFont = Array.from(document.fonts).find(font =>
                    font.family === fontId && font.status === 'loaded'
                );


                if (existingFont) {
                    console.log(`Font ID ${fontId} already loaded, skipping`);
                    return;
                }

                // Get the font URL using ID only
                const fontUrl = await getFontUrl(fontId);

                // Create FontFace with font ID as family name for consistency
                const fontFace = new FontFace(
                    fontId, // Use ID as font family name
                    `url(${fontUrl})`,
                    {
                        display: 'swap',
                        weight: 'normal',
                        style: 'normal'
                    }
                );

                // Add and load the font
                document.fonts.add(fontFace);
                await fontFace.load();

                console.log(`Font loaded successfully: ID ${fontId}`);

            } catch (error) {
                console.error(`Error loading font ID ${fontId}:`, error);
                // Continue with other fonts even if one fails
            }
        });

        await Promise.all(loadPromises);
        console.log('All project fonts loaded successfully');

    } catch (error) {
        console.error('Error loading project fonts:', error);
    }
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
    const processData = async (data, usedFontIds = null) => {
        // Load all fonts before processing the canvas data
        await loadProjectFonts(usedFontIds);

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
                // Check if it's an exported file with usedFonts
                if (data.canvasData && data.usedFonts) {
                    processData(data.canvasData, data.usedFonts);
                } else {
                    processData(data);
                }
            } catch (error) {
                console.error('Error al cargar datos de fabric:', error);
                return;
            }
        };
        reader.onerror = (error) => {
            console.error('Error al leer el archivo:', error);
        };
        reader.readAsText(file);
    } else if (file) {
        if (file.usedFonts) {
            processData(file.savefile, file.usedFonts);
        } else {
            processData(file.savefile || file);
        }
    }
};

export default handleLoadImportedFile;