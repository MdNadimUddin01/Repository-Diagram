import { useState } from "react";
import { BodyContent } from "./component/BodyContent";
import Header from "./component/Header";
import Footer from "./component/Footer";
import { Toaster } from "react-hot-toast"

function App() {


  return (
    <div className="bg-purple-100 min-h-screen w-full">
      <Header />
      <BodyContent />
      <Footer />
      <Toaster position="top-right" />
    </div>

  );
}

export default App;
