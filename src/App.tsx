import { Header } from './components/Header';
import { Profile } from './components/Profile';
import { Skills } from './components/Skills';
import { WorkHistory } from './components/WorkHistory';
import cvData from './data/cv.json';

function App() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-10">
      <Header name={cvData.name} contact={cvData.contact} />
      <Profile text={cvData.profile} />
      <Skills skills={cvData.skills} />
      <WorkHistory jobs={cvData.workHistory} />
    </div>
  );
}

export default App;
