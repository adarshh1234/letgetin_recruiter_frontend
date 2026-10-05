import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ZoomControls } from './ZoomControls';
import { getTemplateComponent } from '../../../templates/registry';

export interface LivePreviewCanvasProps {
  headerActions?: React.ReactNode;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({ headerActions }) => {
  const { resume } = useResumeStore();
  const [zoom, setZoom] = useState<number>(85);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleReset = () => setZoom(100);
  const handleFitWidth = () => setZoom(85);

  const TemplateComponent = getTemplateComponent(resume.templateId);

  return (
    <div className="relative w-full h-full bg-surface-alt/30 border border-border/60 flex flex-col items-center justify-start overflow-auto p-6 scrollbar-thin scrollbar-thumb-border print:p-0 print:bg-transparent print:overflow-visible rounded-2xl">
      {/* Zoom Toolbar overlay */}
      <div className="sticky top-2 z-20 mb-4 flex flex-col items-center gap-2 no-print">
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onFitWidth={handleFitWidth}
        />
        {headerActions}
      </div>

      {/* A4 Paper Viewport Canvas */}
      <div
        className="resume-paper transition-transform duration-150 ease-out origin-top shadow-xl rounded-sm print:transform-none print:shadow-none print:m-0 print:p-0 print:w-[210mm] print:min-h-[297mm]"
        style={{
          transform: `scale(${zoom / 100})`,
          width: '210mm',
          minHeight: '297mm',
        }}
      >
        <TemplateComponent resume={resume} />
      </div>
    </div>
  );
};
