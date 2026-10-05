import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Undo2, Redo2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitWidth: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitWidth,
}) => {
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-md text-slate-700 select-none">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoom <= 50}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-40"
        title="Zoom Out (-)"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <span className="text-xs font-mono font-bold px-2 min-w-[45px] text-center text-sky-600">
        {zoom}%
      </span>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoom >= 150}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-40"
        title="Zoom In (+)"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-3.5 bg-slate-200 mx-1" />

      {/* Undo & Redo Controls */}
      <button
        type="button"
        onClick={onReset}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        title="Undo"
      >
        <Undo2 className="w-3.5 h-3.5 text-slate-500" />
      </button>

      <button
        type="button"
        onClick={onReset}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        title="Redo"
      >
        <Redo2 className="w-3.5 h-3.5 text-slate-500" />
      </button>

      <div className="w-px h-3.5 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={onReset}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        title="Reset to 100%"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onFitWidth}
        className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        title="Fit to Viewport"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

