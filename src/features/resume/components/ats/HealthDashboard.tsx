'use client';

import React from 'react';
import { HealthMetric } from '../../hooks/useAtsAnalysis';
import { Activity, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface HealthDashboardProps {
  metrics: HealthMetric[];
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ metrics }) => {
  const getStatusBadge = (status: HealthMetric['status']) => {
    switch (status) {
      case 'Excellent':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Excellent
          </span>
        );
      case 'Good':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle className="w-3 h-3" /> Good
          </span>
        );
      case 'Needs Improvement':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Info className="w-3 h-3" /> Needs Focus
          </span>
        );
      case 'Warning':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-3 h-3" /> Warning
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Resume Health Dashboard
          </h3>
          <p className="text-xs text-slate-400">Detailed metric breakdown across content, ATS, and impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-200">{m.name}</span>
                {getStatusBadge(m.status)}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 mb-2.5 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    m.score >= 80
                      ? 'bg-emerald-500'
                      : m.score >= 65
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
              <span className="line-clamp-1">{m.explanation}</span>
              <span className="font-bold text-slate-200 shrink-0 ml-2">{m.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
