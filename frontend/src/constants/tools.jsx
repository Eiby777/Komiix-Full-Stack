import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faPlus,
  faSearch,
  faHandPaper,
  faPaintBrush,
  faEraser,
  faClone,
  faMagic,
  faPen,
  faFont,
  faBox,
  faEye,
  faSliders,
  faArrowUpFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { LAYERS } from './layers';

// Define Font Awesome icon components
const FA_RectangleIcon = () => <FontAwesomeIcon icon={faSquare} />;
const FA_PlusIcon = () => <FontAwesomeIcon icon={faPlus} />;
const FA_ScanIcon = () => <FontAwesomeIcon icon={faSearch} />;
const FA_PanIcon = () => <FontAwesomeIcon icon={faHandPaper} />;
const FA_BrushIcon = () => <FontAwesomeIcon icon={faPaintBrush} />;
const FA_EraserIcon = () => <FontAwesomeIcon icon={faEraser} />;
const FA_CloneIcon = () => <FontAwesomeIcon icon={faClone} />;
const FA_AutoCleanIcon = () => <FontAwesomeIcon icon={faMagic} />;
const FA_RedrawIcon = () => <FontAwesomeIcon icon={faPen} />;
const FA_TextIcon = () => <FontAwesomeIcon icon={faFont} />;
const FA_TextBoxIcon = () => <FontAwesomeIcon icon={faBox} />;
const FA_DrawTextIcon = () => <FontAwesomeIcon icon={faPen} />;
const FA_TextScanIcon = () => <FontAwesomeIcon icon={faSearch} />;
const FA_OriginalViewIcon = () => <FontAwesomeIcon icon={faEye} />;
const FA_AdjustTextIcon = () => <FontAwesomeIcon icon={faSliders} />;
const FA_ExportIcon = () => <FontAwesomeIcon icon={faArrowUpFromBracket} />;

export const TOOLS = {
  // Annotation Tools
  RECTANGLE: {
    id: "rectangle",
    label: "Anotar los globos y diálogos",
    title: "Elige el tipo de globo o diálogo",
    icon: FA_RectangleIcon,
    layer: LAYERS.ANNOTATION.id,
    hasSettings: true,
    compatibleWith: ["plus"],
  },
  PLUS: {
    id: "plus",
    label: "Cruz guía",
    icon: FA_PlusIcon,
    layer: LAYERS.ANNOTATION.id,
    hasSettings: false,
    compatibleWith: ["rectangle"],
  },
  SCAN: {
    id: "scan",
    label: "Detectar globos y diálogos",
    icon: FA_ScanIcon,
    layer: LAYERS.ANNOTATION.id,
    hasSettings: false,
  },
  PAN: {
    id: "pan",
    label: "Atrastrar",
    icon: FA_PanIcon,
    layer: "annotation",
    hasSettings: false,
    cursor: "grab",
  },
  // Cleanup Tools
  BRUSH: {
    id: "brush",
    label: "Pincel",
    title: "Configura el pincel",
    icon: FA_BrushIcon,
    layer: LAYERS.CLEANUP.id,
    hasSettings: true,
  },
  ERASER: {
    id: "eraser",
    label: "Borrador",
    icon: FA_EraserIcon,
    layer: LAYERS.CLEANUP.id,
    hasSettings: false,
  },
  CLONE: {
    id: "clone",
    label: "Clonador",
    title: "Configura el clonador",
    icon: FA_CloneIcon,
    layer: LAYERS.CLEANUP.id,
    hasSettings: true,
  },
  AUTO_CLEAN: {
    id: "auto-clean",
    label: "Auto limpiar",
    icon: FA_AutoCleanIcon,
    layer: LAYERS.CLEANUP.id,
    hasSettings: false,
  },
  REDRAW: {
    id: "redraw",
    label: "Re dibujar",
    title: "Configura el Redibujo",
    icon: FA_RedrawIcon,
    layer: LAYERS.CLEANUP.id,
    hasSettings: true,
  },
  // Text Tools
  TEXT: {
    id: "text",
    title: "Configura el texto",
    label: "Agregar texto",
    icon: FA_TextIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: true,
    compatibleWith: ["text-box"],
  },
  TEXT_BOX: {
    id: "text-box",
    title: "Configura la traducción",
    label: "Caja de traduccion",
    icon: FA_TextBoxIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: true,
    compatibleWith: ["text", "draw-text"],
  },
  DRAW_TEXT: {
    id: "draw-text",
    title: "Configura el dibujo y detección de texto",
    label: "Dibujar texto",
    icon: FA_DrawTextIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: true,
    compatibleWith: ["text-box"],
    // shortcut: "T",
  },
  TEXT_SCAN: {
    id: "text-scan",
    label: "Escanea texto",
    icon: FA_TextScanIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: false,
    compatibleWith: [],
  },
  ORIGINAL_VIEW: {
    id: "original-view",
    label: "Vista original",
    icon: FA_OriginalViewIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: false,
    compatibleWith: ["text", "text-box", "draw-text"],
  },
  ADJUST_TEXT: {
    id: "adjust-text",
    label: "Ajustar texto",
    icon: FA_AdjustTextIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: false,
    compatibleWith: ["text", "text-box", "plus"],
    shortcut: "Control + Click",
  },
  EXPORT: {
    id: "export",
    label: "Exportar",
    icon: FA_ExportIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: false,
    compatibleWith: [],
    shortcut: "T",
  },
  EXPORT_TEXT: {
    id: "export-text",
    label: "Exportar/Importar Textos",
    icon: FA_ExportIcon,
    layer: LAYERS.TEXT.id,
    hasSettings: false,
    compatibleWith: [],
  },
};

export const TOOL_GROUPS = {
  ORIGINAL: [TOOLS.PAN],
  ANNOTATION: [TOOLS.RECTANGLE, TOOLS.PLUS, TOOLS.ERASER, TOOLS.PAN, TOOLS.SCAN],
  CLEANUP: [
    TOOLS.BRUSH,
    TOOLS.CLONE,
    TOOLS.ERASER,
    TOOLS.PAN,
    TOOLS.REDRAW,
    TOOLS.AUTO_CLEAN,
  ],
  TEXT: [
    TOOLS.TEXT,
    TOOLS.TEXT_BOX,
    TOOLS.DRAW_TEXT,
    TOOLS.ORIGINAL_VIEW,
    TOOLS.ERASER,
    TOOLS.PAN,
    TOOLS.TEXT_SCAN,
    TOOLS.ADJUST_TEXT,
    TOOLS.EXPORT_TEXT,
  ],
  FINAL: [TOOLS.PAN, TOOLS.EXPORT],
};