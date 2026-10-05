import React from 'react';
import { TemplateProps } from '../registry';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { EditableText } from './EditableText';

export const ExecutiveProTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, educations, skills, projects, certificates, languages, customSections, socialLinks } = resume.content;
  const { primaryColor, fontFamily } = resume.settings;
  const { updatePersonalInfo, updateSummary, updateExperience, updateEducation, updateProject, updateSkill, updateCertificate, updateLanguage } = useResumeStore();

  return (
    <div
      className="w-full bg-white text-slate-900 shadow-sm grid grid-cols-12 leading-relaxed text-xs"
      style={{ fontFamily: fontFamily || 'Inter', minHeight: '297mm' }}
    >
      {/* Left Sidebar Column (4 columns) */}
      <div
        className="col-span-4 p-6 text-white flex flex-col justify-between"
        style={{ backgroundColor: primaryColor || '#0f172a' }}
      >
        <div>
          <div className="mb-6">
            <EditableText
              tagName="h1"
              value={personalInfo.fullName || 'Your Name'}
              onChange={(val) => updatePersonalInfo({ fullName: val })}
              className="text-xl font-bold tracking-tight"
            />
            <div className="mt-1">
              <EditableText
                tagName="p"
                value={personalInfo.headline || 'Headline'}
                onChange={(val) => updatePersonalInfo({ headline: val })}
                className="text-xs text-slate-300 font-medium"
              />
            </div>
          </div>

          {/* Contact Metadata */}
          <div className="space-y-2 text-[11px] text-slate-300 mb-6 pb-4 border-b border-white/20">
            <div>📧 <EditableText value={personalInfo.email || 'Email'} onChange={(val) => updatePersonalInfo({ email: val })} /></div>
            <div>📱 <EditableText value={personalInfo.phone || 'Phone'} onChange={(val) => updatePersonalInfo({ phone: val })} /></div>
            <div>📍 <EditableText value={personalInfo.location || 'Location'} onChange={(val) => updatePersonalInfo({ location: val })} /></div>
            {personalInfo.websiteUrl && (
              <div>
                🌐{' '}
                <a
                  href={personalInfo.websiteUrl.startsWith('http') ? personalInfo.websiteUrl : `https://${personalInfo.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  {personalInfo.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {socialLinks && socialLinks.map((link) => {
              if (!link.url || link.url === 'https://') return null;
              const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
              const label = link.useLabelAsLink !== false && link.label ? link.label : (link.platform || link.url.replace(/^https?:\/\//, ''));
              return (
                <div key={link.id}>
                  🔗{' '}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    {label}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Core Skills</h3>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <div key={s.id} className="text-[11px] bg-white/10 px-2.5 py-1 rounded text-slate-200">
                    <EditableText value={s.name} onChange={(val) => updateSkill(s.id, { name: val })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Sidebar */}
          {educations && educations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Education</h3>
              {educations.map((edu) => (
                <div key={edu.id} className="mb-3 text-[11px]">
                  <EditableText
                    tagName="div"
                    value={edu.degree}
                    onChange={(val) => updateEducation(edu.id, { degree: val })}
                    className="font-bold text-white"
                  />
                  <EditableText
                    tagName="div"
                    value={edu.institution}
                    onChange={(val) => updateEducation(edu.id, { institution: val })}
                    className="text-slate-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Certifications Sidebar */}
          {certificates && certificates.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Certifications</h3>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-[11px]">
                    <EditableText
                      tagName="div"
                      value={cert.name}
                      onChange={(val) => updateCertificate(cert.id, { name: val })}
                      className="font-bold text-white"
                    />
                    <EditableText
                      tagName="div"
                      value={cert.issuer}
                      onChange={(val) => updateCertificate(cert.id, { issuer: val })}
                      className="text-slate-300 text-[10px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Sidebar */}
          {languages && languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Languages</h3>
              <div className="space-y-1 text-[11px] text-slate-200">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <EditableText value={lang.language} onChange={(val) => updateLanguage(lang.id, { language: val })} />
                    <span className="text-slate-400 text-[10px]">
                      <EditableText value={lang.proficiency} onChange={(val) => updateLanguage(lang.id, { proficiency: val as any })} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Main Column (8 columns) */}
      <div className="col-span-8 p-6 space-y-5">
        {/* Executive Summary */}
        {summary !== undefined && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Executive Summary
            </h2>
            <EditableText
              tagName="p"
              value={typeof summary === 'string' ? summary : String(summary || '') || 'Click to edit summary...'}
              onChange={(val) => updateSummary(val)}
              className="text-slate-700 leading-normal"
            />
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-0.5 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                    <EditableText value={exp.position} onChange={(val) => updateExperience(exp.id, { position: val })} />
                    <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">
                    <EditableText value={exp.company} onChange={(val) => updateExperience(exp.id, { company: val })} />
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>
                        <EditableText
                          value={h}
                          onChange={(val) => {
                            const updated = [...exp.highlights];
                            updated[i] = val;
                            updateExperience(exp.id, { highlights: updated });
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-0.5 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>
              Key Projects
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <EditableText value={proj.title} onChange={(val) => updateProject(proj.id, { title: val })} />
                      {proj.subtitle && (
                        <span className="text-[11px] font-medium text-slate-600">
                          – <EditableText value={proj.subtitle} onChange={(val) => updateProject(proj.id, { subtitle: val })} />
                        </span>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-[10px] text-slate-500 font-normal">{proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ''}</span>
                    )}
                  </div>
                  {proj.link && (
                    <div className="text-[10px] text-indigo-600 underline">
                      <EditableText value={proj.link} onChange={(val) => updateProject(proj.id, { link: val })} />
                    </div>
                  )}
                  {proj.description && (
                    <EditableText
                      tagName="p"
                      value={proj.description}
                      onChange={(val) => updateProject(proj.id, { description: val })}
                      className="text-[11px] text-slate-700 mt-1"
                    />
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] font-medium text-slate-500 mt-1">
                      Tech Stack: {proj.technologies.join(', ')}
                    </div>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 mt-1">
                      {proj.highlights.map((h, i) => (
                        <li key={i}>
                          <EditableText
                            value={h}
                            onChange={(val) => {
                              const updated = [...(proj.highlights || [])];
                              updated[i] = val;
                              updateProject(proj.id, { highlights: updated });
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-6 mt-6">
            {customSections.map((sec) => {
              if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
              return (
                <div key={sec.id} className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200">
                    {sec.title}
                  </h2>
                  <div className="space-y-3">
                    {sec.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                          {item.date && <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>}
                        </div>
                        {item.subtitle && <div className="text-[11px] text-slate-600 font-medium">{item.subtitle}</div>}
                        {item.description && (
                          <p className="text-[11px] text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
