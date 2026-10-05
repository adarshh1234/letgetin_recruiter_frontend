import React from 'react';
import { TemplateProps } from '../registry';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { EditableText } from './EditableText';

export const ModernSleekTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, educations, skills, projects, certificates, languages, customSections, socialLinks } = resume.content;
  const { primaryColor, fontFamily } = resume.settings;
  const { updatePersonalInfo, updateSummary, updateExperience, updateEducation, updateProject, updateSkill, updateCertificate, updateLanguage } = useResumeStore();

  return (
    <div
      className="w-full bg-white text-slate-900 p-8 shadow-sm flex flex-col justify-between leading-relaxed text-xs"
      style={{ fontFamily: fontFamily || 'Inter', minHeight: '297mm' }}
    >
      <div>
        {/* Header */}
        <div className="rounded-xl p-6 mb-6 text-white shadow-md" style={{ backgroundColor: primaryColor || '#0f172a' }}>
          <EditableText
            tagName="h1"
            value={personalInfo.fullName || 'Your Full Name'}
            onChange={(val) => updatePersonalInfo({ fullName: val })}
            className="text-2xl font-black tracking-tight"
          />
          <div className="mt-0.5">
            <EditableText
              tagName="p"
              value={personalInfo.headline || 'Professional Headline'}
              onChange={(val) => updatePersonalInfo({ headline: val })}
              className="text-sm font-medium text-indigo-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-200 mt-4 pt-3 border-t border-white/10">
            <div>
              📧 <EditableText value={personalInfo.email || 'email@example.com'} onChange={(val) => updatePersonalInfo({ email: val })} />
            </div>
            <div>
              📱 <EditableText value={personalInfo.phone || '+1 (555) 000-0000'} onChange={(val) => updatePersonalInfo({ phone: val })} />
            </div>
            <div>
              📍 <EditableText value={personalInfo.location || 'Location'} onChange={(val) => updatePersonalInfo({ location: val })} />
            </div>
            {personalInfo.websiteUrl && (
              <div>
                🌐{' '}
                <a
                  href={personalInfo.websiteUrl.startsWith('http') ? personalInfo.websiteUrl : `https://${personalInfo.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white underline"
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
                    className="text-indigo-200 hover:text-white underline"
                  >
                    {label}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {summary !== undefined && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Professional Profile
            </h2>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <EditableText
                tagName="p"
                value={typeof summary === 'string' ? summary : String(summary || '') || 'Click to write your summary...'}
                onChange={(val) => updateSummary(val)}
                className="text-slate-700 leading-normal"
              />
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="flex justify-between items-baseline">
                    <EditableText
                      tagName="span"
                      value={exp.position}
                      onChange={(val) => updateExperience(exp.id, { position: val })}
                      className="font-bold text-slate-900 text-xs"
                    />
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      <EditableText
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(val) => {
                          const parts = val.split('-');
                          updateExperience(exp.id, { startDate: parts[0]?.trim(), endDate: parts[1]?.trim() });
                        }}
                      />
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    <EditableText value={exp.company} onChange={(val) => updateExperience(exp.id, { company: val })} />
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1.5 space-y-1">
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2">
                      <EditableText
                        tagName="span"
                        value={proj.title}
                        onChange={(val) => updateProject(proj.id, { title: val })}
                        className="font-bold text-slate-900"
                      />
                      {proj.subtitle && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          • <EditableText value={proj.subtitle} onChange={(val) => updateProject(proj.id, { subtitle: val })} />
                        </span>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-[10px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {proj.startDate} {proj.endDate ? `- ${proj.endDate}` : ''}
                      </span>
                    )}
                  </div>
                  {proj.link && (
                    <div className="text-[10px] text-indigo-600 font-medium mt-0.5 underline">
                      <EditableText value={proj.link} onChange={(val) => updateProject(proj.id, { link: val })} />
                    </div>
                  )}
                  {proj.description && (
                    <EditableText
                      tagName="p"
                      value={proj.description}
                      onChange={(val) => updateProject(proj.id, { description: val })}
                      className="text-[11px] text-slate-700 mt-1 leading-normal"
                    />
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1.5 space-y-1">
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

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-2 gap-4">
          {educations && educations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Education
              </h2>
              {educations.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <EditableText
                    tagName="div"
                    value={edu.degree}
                    onChange={(val) => updateEducation(edu.id, { degree: val })}
                    className="font-bold text-slate-900 text-xs"
                  />
                  <EditableText
                    tagName="div"
                    value={edu.institution}
                    onChange={(val) => updateEducation(edu.id, { institution: val })}
                    className="text-[11px] text-slate-600"
                  />
                </div>
              ))}
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{ backgroundColor: `${primaryColor}10`, color: primaryColor, borderColor: `${primaryColor}30` }}
                  >
                    <EditableText value={s.name} onChange={(val) => updateSkill(s.id, { name: val })} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Languages Grid */}
        {(certificates?.length > 0 || languages?.length > 0) && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {certificates && certificates.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Certifications
                </h2>
                <div className="space-y-1.5">
                  {certificates.map((cert) => (
                    <div key={cert.id}>
                      <EditableText
                        tagName="div"
                        value={cert.name}
                        onChange={(val) => updateCertificate(cert.id, { name: val })}
                        className="font-bold text-slate-900 text-xs"
                      />
                      <EditableText
                        tagName="div"
                        value={cert.issuer}
                        onChange={(val) => updateCertificate(cert.id, { issuer: val })}
                        className="text-[11px] text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Languages
                </h2>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {languages.map((lang) => (
                    <span
                      key={lang.id}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700"
                    >
                      <EditableText value={lang.language} onChange={(val) => updateLanguage(lang.id, { language: val })} /> (
                      <EditableText value={lang.proficiency} onChange={(val) => updateLanguage(lang.id, { proficiency: val as any })} />)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-4 mt-6">
            {customSections.map((sec) => {
              if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
              return (
                <div key={sec.id}>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"
                    style={{ color: primaryColor }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    {sec.title}
                  </h2>
                  <div className="space-y-3">
                    {sec.items.map((item) => (
                      <div key={item.id} className="border-l-2 pl-3" style={{ borderColor: `${primaryColor}30` }}>
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
