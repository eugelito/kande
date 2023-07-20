import { useRef } from "react";
import "./App.css";
import IntroHeader from "./components/IntroHeader";
import UploadWidget from "./components/UploadWidget";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="max-w-2xl">
      <IntroHeader />
      <UploadWidget />
      {/* <Gallery /> */}
      <Footer />
    </div>
  );
};

export default App;
