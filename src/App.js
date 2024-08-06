import logo from "./logo.svg";
import "./App.css";
import SpecLibraryForm from "./components/SpecLibraryForm/SpecLibraryForm";
import { SpecLibraryDummyData } from "./components/SpecLibraryForm/SpecLibraryFormDummyData";

function App() {
  return (
    <div className="App">
      <SpecLibraryForm data={SpecLibraryDummyData} />
    </div>
  );
}

export default App;
