import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Award, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { ICertificate } from '../../types';

export const CertificatesForm: React.FC = () => {
  const { resume, addCertificate, updateCertificate, removeCertificate, reorderCertificates } = useResumeStore();
  const certificates = resume.content.certificates || [];

  const handleAdd = () => {
    const newCert: ICertificate = {
      id: `cert-${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023-04',
      credentialUrl: '',
    };
    addCertificate(newCert);
  };

  const moveCert = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;
    const items = [...certificates];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    if (reorderCertificates) reorderCertificates(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary-glow" />
          <h3 className="text-sm font-bold text-ink">Certifications & Licenses</h3>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No certifications added yet. Click &quot;Add Certificate&quot; to add your credentials.
        </div>
      ) : (
        certificates.map((cert, idx) => (
          <div key={cert.id} className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  #{idx + 1}
                </span>
                <span className="text-xs font-semibold text-ink">{cert.name || 'Certificate'}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveCert(idx, 'up')}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === certificates.length - 1}
                  onClick={() => moveCert(idx, 'down')}
                  className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeCertificate(cert.id)}
                  className="p-1 text-destructive hover:opacity-80 ml-2"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-ink-soft font-semibold mb-1">Certificate / License Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertificate(cert.id, { name: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="input-base text-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft font-semibold mb-1">Issuer / Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertificate(cert.id, { issuer: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="input-base text-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft font-semibold mb-1">Issue Date</label>
                <input
                  type="text"
                  value={cert.issueDate || ''}
                  onChange={(e) => updateCertificate(cert.id, { issueDate: e.target.value })}
                  placeholder="YYYY-MM"
                  className="input-base text-xs"
                />
              </div>

              <div>
                <label className="block text-ink-soft font-semibold mb-1">Credential URL / Verification Link</label>
                <input
                  type="text"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => updateCertificate(cert.id, { credentialUrl: e.target.value })}
                  placeholder="https://example.com/verify/123"
                  className="input-base text-xs"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
