import React from 'react';
import BrushSettings from '../../tools/components/CLEANUP/brush/BrushSettings';
import RectangleSettings from '../../tools/components/ANNOTATION/rectangle/RectangleSettings';
import CloneSettings from '../../tools/components/CLEANUP/clone/CloneSettings';
import TextSettings from '../../tools/components/TYPE/text/TextSettings';
import TranslationSettings from '../../tools/components/TYPE/translation/TranslationSettings';
import RedrawSettings from '../../tools/components/CLEANUP/redraw/RedrawSettings'
import DrawTextSettings from '../../tools/components/TYPE/draw_text/DrawTextSetting';
import { TOOLS } from '../../../../constants/tools';

export default function ToolSettings({ tool, id, className = '', style = {} }) {
  return (
    <div
      id={id}
      className={`w-full overflow-hidden ${className}`}
      style={{ 
        transition: 'height 0.3s ease', 
        display: 'flex',
        flexDirection: 'column',
        ...style 
      }}
    >
      <h2 className="text-lg font-semibold text-center mb-4 sticky top-0 bg-[#1a1a1a] z-10 flex-shrink-0">
        {tool.title}
      </h2>
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        <div className="space-y-4">
          {tool.id === TOOLS.BRUSH.id && <BrushSettings />}
          {tool.id === TOOLS.RECTANGLE.id && <RectangleSettings />}
          {tool.id === TOOLS.CLONE.id && <CloneSettings />}
          {tool.id === TOOLS.TEXT.id && <TextSettings />}
          {tool.id === TOOLS.TEXT_BOX.id && <TranslationSettings />}
          {tool.id === TOOLS.REDRAW.id && <RedrawSettings />}
          {tool.id === TOOLS.DRAW_TEXT.id && <DrawTextSettings />}
        </div>
      </div>
    </div>
  );
}