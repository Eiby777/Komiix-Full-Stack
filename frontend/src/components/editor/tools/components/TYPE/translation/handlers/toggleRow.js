import { useCallback } from 'react';

export const toggleRow = (setExpandedRows) =>
  useCallback(
    (id) => {
      setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setExpandedRows]
  );