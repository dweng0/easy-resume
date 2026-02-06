interface ProfileProps {
  text: string;
}

export function Profile({ text }: ProfileProps) {
  return (
    <section className="mb-9">
      <h2 className="text-2xl font-bold text-blue-900 mb-5 pb-2 border-b-2 border-slate-200 flex items-center gap-3">
        <i className="fas fa-user text-blue-500 text-xl"></i>
        Profile
      </h2>
      <p className="text-slate-500 text-base leading-relaxed text-justify">
        {text}
      </p>
    </section>
  );
}
