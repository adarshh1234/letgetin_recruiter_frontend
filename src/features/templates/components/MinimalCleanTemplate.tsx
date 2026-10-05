import React from 'react';
import { TemplateProps } from '../registry';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { EditableText } from './EditableText';

export const MinimalCleanTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, educations, skills, projects, certificates, languages, customSections, socialLinks } = resume.content;
  const { primaryColor, fontFamily } = resume.settings;
  const { updatePersonalInfo, updateSummary, updateExperience, updateEducation, updateProject, updateSkill, updateCertificate, updateLanguage } = useResumeStore();

  return (
    <div
      className="w-full bg-white text-slate-900 p-8 shadow-sm flex flex-col justify-between font-sans leading-relaxed text-xs"
      style={{ fontFamily: fontFamily || 'Inter', minHeight: '297mm' }}
    >
      <div>
        {/* Minimal Clean Header */}
        <div className="mb-6 pb-4 border-b border-slate-200">
          <EditableText
            tagName="h1"
            value={personalInfo.fullName || 'Your Name'}
            onChange={(val) => updatePersonalInfo({ fullName: val })}
            className="text-3xl font-light tracking-tight text-slate-900"
          />
          <div className="mt-1">
            <EditableText
              tagName="p"
              value={personalInfo.headline || 'Headline'}
              onChange={(val) => updatePersonalInfo({ headline: val })}
              className="text-xs font-medium uppercase tracking-widest text-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 mt-3 font-mono">
            <EditableText value={personalInfo.email || 'Email'} onChange={(val) => updatePersonalInfo({ email: val })} />
            <EditableText value={personalInfo.phone || 'Phone'} onChange={(val) => updatePersonalInfo({ phone: val })} />
            <EditableText value={personalInfo.location || 'Location'} onChange={(val) => updatePersonalInfo({ location: val })} />
            {personalInfo.websiteUrl && (
              <a
                href={personalInfo.websiteUrl.startsWith('http') ? personalInfo.websiteUrl : `https://${personalInfo.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {personalInfo.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            )}
            {socialLinks && socialLinks.map((link) => {
              if (!link.url || link.url === 'https://') return null;
              const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
              const label = link.useLabelAsLink !== false && link.label ? link.label : (link.platform || link.url.replace(/^https?:\/\//, ''));
              return (
                <a
                  key={link.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">01 / PROFILE</h2>
            <EditableText
              tagName="p"
              value={summary}
              onChange={updateSummary}
              className="text-slate-600 leading-relaxed"
            />
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">02 / EXPERIENCE</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <EditableText
                      tagName="span"
                      value={exp.position}
                      onChange={(val) => updateExperience(exp.id, { position: val })}
                      className="font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">
                      <EditableText value={exp.startDate} onChange={(val) => updateExperience(exp.id, { startDate: val })} /> -{' '}
                      <EditableText value={exp.endDate} onChange={(val) => updateExperience(exp.id, { endDate: val })} />
                    </span>
                  </div>
                  <EditableText
                    tagName="div"
                    value={exp.company}
                    onChange={(val) => updateExperience(exp.id, { company: val })}
                    className="text-[11px] text-slate-600 mb-1"
                  />
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 mt-1">
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">03 / PROJECTS</h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <EditableText
                      tagName="span"
                      value={proj.title}
                      onChange={(val) => updateProject(proj.id, { title: val })}
                      className="font-bold text-slate-900"
                    />
                    {proj.link && (
                      <EditableText
                        tagName="span"
                        value={proj.link}
                        onChange={(val) => updateProject(proj.id, { link: val })}
                        className="text-[10px] text-blue-600 font-mono"
                      />
                    )}
                  </div>
                  {proj.description && (
                    <EditableText
                      tagName="p"
                      value={proj.description}
                      onChange={(val) => updateProject(proj.id, { description: val })}
                      className="text-[11px] text-slate-600"
                    />
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 mt-1">
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

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-6">
          {educations && educations.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">04 / EDUCATION</h2>
              {educations.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <EditableText
                    tagName="div"
                    value={edu.degree}
                    onChange={(val) => updateEducation(edu.id, { degree: val })}
                    className="font-bold text-slate-900"
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
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">05 / SKILLS</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className="text-[10px] text-slate-700 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    <EditableText value={s.name} onChange={(val) => updateSkill(s.id, { name: val })} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Languages Grid */}
        {(certificates?.length > 0 || languages?.length > 0) && (
          <div className="grid grid-cols-2 gap-6 mt-6">
            {certificates && certificates.length > 0 && (
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">06 / CERTIFICATIONS</h2>
                <div className="space-y-2">
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
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">07 / LANGUAGES</h2>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {languages.map((lang) => (
                    <div key={lang.id} className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      <EditableText value={lang.language} onChange={(val) => updateLanguage(lang.id, { language: val })} /> (
                      <EditableText value={lang.proficiency} onChange={(val) => updateLanguage(lang.id, { proficiency: val as any })} />)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-6 mt-6">
            {customSections.map((sec, secIdx) => {
              if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
              return (
                <div key={sec.id}>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    0{8 + secIdx} / {sec.title.toUpperCase()}
                  </h2>
                  <div className="space-y-3">
                    {sec.items.map((item) => (
                      <div key={item.id} className="border-l-2 border-slate-200 pl-3">
                        <div className="flex justify-between items-baseline">
                          <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                          {item.date && <div className="text-[10px] text-slate-400 font-mono">{item.date}</div>}
                        </div>
                        {item.subtitle && <div className="text-[11px] text-slate-600 font-medium">{item.subtitle}</div>}
                        {item.description && (
                          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 whitespace-pre-line">
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
