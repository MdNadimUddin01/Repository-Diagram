import { FileText } from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Repository Diagram</h1>
              <p className="text-sm text-slate-600">Visualize your code structure</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button className=" cursor-pointer text-slate-700 hover:text-slate-900 font-medium transition-colors">Home</button>
            <a href="https://github.com/MdNadimUddin01/Repository-Diagram" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">About</a>
            <a href="https://github.com/MdNadimUddin01/Repository-Diagram" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">Documentation</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
