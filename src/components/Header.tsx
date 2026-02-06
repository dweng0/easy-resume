import type { ContactInfo } from '../types';

interface HeaderProps {
  name: string;
  contact: ContactInfo;
}

export function Header({ name, contact }: HeaderProps) {
  return (
    <header className="text-center mb-10 pb-8 border-b-4 border-blue-900">
      <h1 className="text-4xl font-bold text-blue-900 mb-4 tracking-tight">
        {name}
      </h1>
      <div className="text-slate-500 mb-2">{contact.address}</div>
      <div className="flex justify-center gap-6 flex-wrap mt-4 text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <i className="fas fa-envelope text-blue-500"></i>
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-phone text-blue-500"></i>
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fab fa-github text-blue-500"></i>
          <span>{contact.github}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fab fa-linkedin text-blue-500"></i>
          <span>{contact.linkedin}</span>
        </div>

      </div>
    </header>
  );
}
