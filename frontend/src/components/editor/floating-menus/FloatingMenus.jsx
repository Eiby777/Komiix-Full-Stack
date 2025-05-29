import UndoRedoMenu from "./components/UndoRedoMenu/UndoRedoMenu";
import Layers from "./components/Layers";
import ZoomControls from "./components/ZoomControls";
import ToggleConfigButton from "./components/ToggleConfigButton";
import { useCanvasZoom } from "../canvas/handlers/useCanvasZoom";

const FloatingMenus = () => {
    const zoomControls = useCanvasZoom();
    return (
        <>
            <UndoRedoMenu />
            <Layers />
            <ZoomControls {...zoomControls}/>
            <ToggleConfigButton />
        </>
    );
};

export default FloatingMenus;