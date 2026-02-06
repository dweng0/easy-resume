import type { Job } from '../types';

interface WorkHistoryProps {
  jobs: Job[];
}

export function WorkHistory({ jobs }: WorkHistoryProps) {
  return (
    <section className="mb-9">
      <h2 className="text-2xl font-bold text-blue-900 mb-5 pb-2 border-b-2 border-slate-200 flex items-center gap-3">
        <i className="fas fa-briefcase text-blue-500 text-xl"></i>
        Work History
      </h2>
      <div className="space-y-8">
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </section>
  );
}

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <article className="print:break-inside-avoid">
      <div className="flex justify-between items-baseline mb-2 flex-wrap">
        <h3 className="text-xl font-bold text-blue-900">{job.company}</h3>
        <span className="text-blue-500 text-sm font-semibold">{job.period}</span>
      </div>
      <div className="text-blue-700 text-base font-semibold mb-2">
        {job.role}
      </div>
      <p className="text-slate-500 text-sm mb-4 leading-relaxed">
        {job.description}
      </p>
      {job.achievements && job.achievements.length > 0 && (
        <ul className="space-y-2">
          {job.achievements.map((achievement, index) => (
            <li
              key={index}
              className="text-slate-500 text-sm leading-relaxed pl-6 relative before:content-['▸'] before:text-blue-500 before:font-bold before:absolute before:left-2"
            >
              {achievement.includes(':') ? (
                <>
                  <strong>{achievement.split(':')[0]}:</strong>
                  {achievement.split(':').slice(1).join(':')}
                </>
              ) : (
                achievement
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
