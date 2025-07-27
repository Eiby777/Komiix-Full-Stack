import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createCanvasSlice } from './slices/canvasSlice';
import { createProjectSlice } from './slices/projectSlice';
import { createZoomSlice } from './slices/zoomSlice';
import { createToolSlice } from './slices/toolSlice';
import { createLayerSlice } from './slices/layerSlice';
import { createAnnotationSlice } from './slices/annotationSlice';
import { createTextSlice } from './slices/textSlice';
import { createScreenSlice } from './slices/screenSlice';
import { createDashboardSlice } from './slices/dashboardSlice';

export const useEditorStore = create(immer((set, get) => ({
  ...createCanvasSlice(set, get),
  ...createProjectSlice(set, get),
  ...createZoomSlice(set, get),
  ...createToolSlice(set, get),
  ...createLayerSlice(set, get),
  ...createAnnotationSlice(set, get),
  ...createTextSlice(set, get),
  ...createScreenSlice(set, get),
  ...createDashboardSlice(set, get),
})));

