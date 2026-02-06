import type { SkillCategory } from '../types';

interface SkillsProps {
  skills: SkillCategory[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section className="mb-9">
      <h2 className="text-2xl font-bold text-blue-900 mb-5 pb-2 border-b-2 border-slate-200 flex items-center gap-3">
        <i className="fas fa-code text-blue-500 text-xl"></i>
        Core Competencies
      </h2>
      <div className="grid grid-cols-2 gap-5">
        {skills.map((category, index) => (
          <div
            key={index}
            className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500"
          >
            <h4 className="text-blue-900 text-sm font-bold mb-2">
              {category.title}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              {category.skills}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
