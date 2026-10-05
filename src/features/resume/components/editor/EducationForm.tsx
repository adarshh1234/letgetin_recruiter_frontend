import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { IEducation } from "../../types";

export const EducationForm: React.FC = () => {
  const { resume, addEducation, updateEducation, removeEducation } =
    useResumeStore();
  const educations = resume.content.educations;

  const handleAdd = () => {
    const newEdu: IEducation = {
      id: `edu-${Date.now()}`,
      institution: "University Name",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2019-08",
      endDate: "2023-05",
      isCurrent: false,
      gradeScore: "3.8 GPA",
    };
    addEducation(newEdu);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary-glow" />
          <h3 className="text-sm font-bold text-ink">Education & Degrees</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>
      </div>

      {educations.map((edu) => (
        <div
          key={edu.id}
          className="bg-surface p-5 rounded-2xl border border-border space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-semibold text-ink">
              {edu.institution || "University"}
            </span>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-destructive hover:opacity-80 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-ink-soft font-semibold mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, { institution: e.target.value })
                }
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-ink-soft font-semibold mb-1">
                Degree
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-ink-soft font-semibold mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  updateEducation(edu.id, { fieldOfStudy: e.target.value })
                }
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="block text-ink-soft font-semibold mb-1">
                Graduation Year / Dates
              </label>
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) =>
                  updateEducation(edu.id, { endDate: e.target.value })
                }
                className="input-base text-xs"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
