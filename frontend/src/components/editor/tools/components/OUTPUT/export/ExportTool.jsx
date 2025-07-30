import React, { useState } from 'react';
import { X } from 'lucide-react';
import ExportMode from './components/ExportMode';
import FileNameInput from './components/FileNameInput';
import FormatAndQuality from './components/FormatAndQuality';
import DimensionsInput from './components/DimensionsInput';
import AdvancedOptions from './components/AdvancedOptions';
import ColorAndMode from './components/ColorAndMode';
import { useEditorStore } from '../../../../../../stores/editorStore';
import useUpdateDimensions from './hooks/useUpdateDimensions';
import ExportButton from './components/ExportButton';

const ExportTool = () => {
  const { resetActiveTools, canvasInstances, dimensionImages, activeImageIndex, images } = useEditorStore();
  const [format, setFormat] = useState('JPEG');
  const [quality, setQuality] = useState(80);
  const [dimensions, setDimensions] = useState({ width: '', height: '' });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [imageMode, setImageMode] = useState('RGB');
  const [interlacing, setInterlacing] = useState(false);
  const [fileName, setFileName] = useState('image');
  const [exportAll, setExportAll] = useState(false);
  const [resizeAll, setResizeAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useUpdateDimensions(setDimensions, dimensionImages, activeImageIndex)

  const handleClose = () => resetActiveTools();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[600]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[#262626] border border-white/10 rounded-2xl shadow-2xl w-[680px] max-h-[90vh] overflow-y-auto text-white">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Opciones de Exportación</h2>
          <button onClick={handleClose} className="text-white hover:text-red-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6">
          <ExportMode exportAll={exportAll} setExportAll={setExportAll} />
          <FileNameInput exportAll={exportAll} fileName={fileName} setFileName={setFileName} />
          <FormatAndQuality
            format={format}
            setFormat={setFormat}
            quality={quality}
            setQuality={setQuality}
          />
          <DimensionsInput
            initialDimensions={dimensionImages[activeImageIndex]}
            dimensions={dimensions}
            setDimensions={setDimensions}
            maintainAspectRatio={maintainAspectRatio}
            setMaintainAspectRatio={setMaintainAspectRatio}
            exportAll={exportAll}
            resizeAll={resizeAll}
            setResizeAll={setResizeAll}
          />
          <ColorAndMode
            imageMode={imageMode}
            setImageMode={setImageMode}
          />
          <AdvancedOptions
            includeMetadata={includeMetadata}
            setIncludeMetadata={setIncludeMetadata}
            interlacing={interlacing}
            setInterlacing={setInterlacing}
          />
          <ExportButton
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            exportAll={exportAll}
            canvasInstances={canvasInstances}
            activeImageIndex={activeImageIndex}
            images={images}
            format={format}
            quality={quality}
            dimensions={dimensions}
            maintainAspectRatio={maintainAspectRatio}
            imageMode={imageMode}
            includeMetadata={includeMetadata}
            interlacing={interlacing}
            fileName={fileName}
            resizeAll={resizeAll}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportTool;
