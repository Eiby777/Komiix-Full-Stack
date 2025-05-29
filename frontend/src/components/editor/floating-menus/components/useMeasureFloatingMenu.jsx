import { useEffect } from 'react';
import { useEditorStore } from '../../../../stores/editorStore';

const useMeasureFloatingMenu = (ref, menuType) => {
  const setFloatingMenuSize = useEditorStore(state => state.setFloatingMenuSize);

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setFloatingMenuSize(menuType, { width, height });
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Medición inicial
    updateSize();

    return () => resizeObserver.disconnect();
  }, [ref, menuType, setFloatingMenuSize]);
};

export default useMeasureFloatingMenu;
