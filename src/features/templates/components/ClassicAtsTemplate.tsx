import React from 'react';
import { TemplateProps } from '../registry';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { EditableText } from './EditableText';

export const ClassicAtsTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, summary, experiences, educations, skills, projects, certificates, languages, customSections, socialLinks } = resume.content;
  const { fontFamily } = resume.settings;
  const { updatePersonalInfo, updateSummary, updateExperience, updateEducation, updateProject, updateSkill, updateCertificate, updateLanguage } = useResumeStore();

  return (
    <div
      className="w-full bg-white text-slate-900 p-8 shadow-sm font-serif leading-normal text-xs"
      style={{ fontFamily: fontFamily === 'Inter' ? 'Georgia, serif' : fontFamily, minHeight: '297mm' }}
    >
      {/* Header */}
      <div className="text-center border-b border-slate-900 pb-3 mb-4">
        <EditableText
          tagName="h1"
          value={personalInfo.fullName || 'YOUR NAME'}
          onChange={(val) => updatePersonalInfo({ fullName: val })}
          className="text-2xl font-bold uppercase tracking-wider text-slate-900"
        />
        <div className="mt-0.5">
          <EditableText
            tagName="p"
            value={personalInfo.headline || 'PROFESSIONAL HEADLINE'}
            onChange={(val) => updatePersonalInfo({ headline: val })}
            className="text-xs font-semibold text-slate-700"
          />
        </div>
        <div className="text-[11px] text-slate-600 mt-1 flex justify-center items-center flex-wrap gap-2">
          <EditableText value={personalInfo.location || 'Location'} onChange={(val) => updatePersonalInfo({ location: val })} />
          <span>|</span>
          <EditableText value={personalInfo.phone || 'Phone'} onChange={(val) => updatePersonalInfo({ phone: val })} />
          <span>|</span>
          <EditableText value={personalInfo.email || 'Email'} onChange={(val) => updatePersonalInfo({ email: val })} />
          {personalInfo.websiteUrl && (
            <>
              <span>|</span>
              <a
                href={personalInfo.websiteUrl.startsWith('http') ? personalInfo.websiteUrl : `https://${personalInfo.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:underline"
              >
                {personalInfo.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
          {socialLinks && socialLinks.map((link) => {
            if (!link.url || link.url === 'https://') return null;
            const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
            const label = link.useLabelAsLink !== false && link.label ? link.label : (link.platform || link.url.replace(/^https?:\/\//, ''));
            return (
              <React.Fragment key={link.id}>
                <span>|</span>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:underline"
                >
                  {label}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {summary !== undefined && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1 text-slate-900">
            PROFESSIONAL SUMMARY
          </h2>
          <EditableText
            tagName="p"
            value={typeof summary === 'string' ? summary : String(summary || '') || 'Click to write summary...'}
            onChange={(val) => updateSummary(val)}
            className="text-slate-800 leading-relaxed text-justify"
          />
        </div>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2 text-slate-900">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <EditableText value={exp.company} onChange={(val) => updateExperience(exp.id, { company: val })} />
                  <span className="text-[10px] font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic text-slate-700 mb-1">
                  <EditableText value={exp.position} onChange={(val) => updateExperience(exp.id, { position: val })} />
                </div>
                <ul className="list-disc list-outside ml-4 text-slate-800 space-y-0.5">
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

      {/* Education */}
      {educations && educations.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2 text-slate-900">
            EDUCATION
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline mb-1">
              <div>
                <EditableText
                  tagName="span"
                  value={edu.institution}
                  onChange={(val) => updateEducation(edu.id, { institution: val })}
                  className="font-bold"
                />{' '}
                — <EditableText value={edu.degree} onChange={(val) => updateEducation(edu.id, { degree: val })} />
              </div>
              <span className="text-[10px] font-normal">{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2 text-slate-900">
            PROJECTS
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <EditableText value={proj.title} onChange={(val) => updateProject(proj.id, { title: val })} />
                    {proj.subtitle && (
                      <span className="font-normal text-slate-600">
                        | <EditableText value={proj.subtitle} onChange={(val) => updateProject(proj.id, { subtitle: val })} />
                      </span>
                    )}
                    {proj.link && (
                      <span className="font-normal text-indigo-700 underline text-[10px]">
                        (<EditableText value={proj.link} onChange={(val) => updateProject(proj.id, { link: val })} />)
                      </span>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-[10px] font-normal">{proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}</span>
                  )}
                </div>
                {proj.description && (
                  <EditableText
                    tagName="p"
                    value={proj.description}
                    onChange={(val) => updateProject(proj.id, { description: val })}
                    className="text-slate-700 mt-0.5 leading-relaxed"
                  />
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[10px] text-slate-600 italic mt-0.5">
                    Technologies: {proj.technologies.join(', ')}
                  </div>
                )}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-slate-800 space-y-0.5 mt-0.5">
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

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">
            SKILLS & TECHNICAL PROFICIENCY
          </h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <span key={s.id} className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                <EditableText value={s.name} onChange={(val) => updateSkill(s.id, { name: val })} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certificates && certificates.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">
            CERTIFICATIONS & LICENSES
          </h2>
          <div className="space-y-1">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-[11px]">
                <div>
                  <EditableText
                    tagName="span"
                    value={cert.name}
                    onChange={(val) => updateCertificate(cert.id, { name: val })}
                    className="font-bold text-slate-900"
                  />{' '}
                  — <EditableText value={cert.issuer} onChange={(val) => updateCertificate(cert.id, { issuer: val })} />
                </div>
                {cert.issueDate && <span className="text-[10px] text-slate-600">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">
            LANGUAGES
          </h2>
          <div className="flex flex-wrap gap-3 text-[11px]">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center gap-1">
                <EditableText
                  tagName="span"
                  value={lang.language}
                  onChange={(val) => updateLanguage(lang.id, { language: val })}
                  className="font-bold text-slate-900"
                />
                <span className="text-slate-600">
                  (<EditableText value={lang.proficiency} onChange={(val) => updateLanguage(lang.id, { proficiency: val as any })} />)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((sec) => {
            if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
            return (
              <div key={sec.id} className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-1.5 text-slate-900">
                  {sec.title.toUpperCase()}
                </h2>
                <div className="space-y-2">
                  {sec.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <span className="font-bold text-slate-900">{item.title}</span>
                          {item.subtitle && <span className="text-slate-700 italic"> — {item.subtitle}</span>}
                        </div>
                        {item.date && <span className="text-[10px] text-slate-600">{item.date}</span>}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-700 mt-0.5 whitespace-pre-line leading-relaxed">
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
  );
};
