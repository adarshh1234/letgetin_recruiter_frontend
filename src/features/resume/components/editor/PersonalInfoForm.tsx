import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { User, Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resume, updatePersonalInfo, setActiveResumeContext } = useResumeStore();
  const info = resume.content.personalInfo;

  return (
    <div className="space-y-4 bg-surface p-5 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <User className="w-4 h-4 text-primary-glow" />
          Personal Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              value={info.fullName || ''}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="e.g. Alex Rivera"
              className="input-base pl-9 text-xs"
            />
            <User className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Professional Headline</label>
          <div className="relative">
            <input
              type="text"
              value={info.headline || ''}
              onFocus={() =>
                setActiveResumeContext({
                  section: 'personalInfo',
                  field: 'headline',
                  value: info.headline || '',
                })
              }
              onChange={(e) => {
                updatePersonalInfo({ headline: e.target.value });
                setActiveResumeContext({
                  section: 'personalInfo',
                  field: 'headline',
                  value: e.target.value,
                });
              }}
              placeholder="e.g. Senior Full Stack Engineer"
              className="input-base pl-9 text-xs"
            />
            <Briefcase className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={info.email || ''}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="alex@example.com"
              className="input-base pl-9 text-xs"
            />
            <Mail className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="text"
              value={info.phone || ''}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="input-base pl-9 text-xs"
            />
            <Phone className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Location</label>
          <div className="relative">
            <input
              type="text"
              value={info.location || ''}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="San Francisco, CA"
              className="input-base pl-9 text-xs"
            />
            <MapPin className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-soft mb-1">Portfolio / Website URL</label>
          <div className="relative">
            <input
              type="url"
              value={info.websiteUrl || ''}
              onChange={(e) => updatePersonalInfo({ websiteUrl: e.target.value })}
              placeholder="https://yourwebsite.com"
              className="input-base pl-9 text-xs"
            />
            <Globe className="w-4 h-4 text-ink-soft absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
