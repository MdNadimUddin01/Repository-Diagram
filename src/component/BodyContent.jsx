import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Github, FileText, ArrowRight } from 'lucide-react';
import { TreeStructure } from './TreeStructure';
import axios from 'axios';
import { FlowChart } from './FlowChart';
import { flowchartCodeApi } from '../../api';
import { toast } from "react-hot-toast"


export function BodyContent() {

  const [repoUrl, setRepoUrl] = useState('');
  const [branchName, setBranchName] = useState("main");
  const [isLoading, setIsLoading] = useState(false);
  const [githubTree, setGtihubTree] = useState([{
    id: 1, depth: 1, text: '', depthIndicator: ''
  }]);
  const [mermaidCode, setMermaidCode] = useState()
  const [repoName, setRepoName] = useState("Root Folder Name");
  const [apiError, setApiError] = useState(null);

  const contentRef = useRef();

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isLast = useCallback(
    (id, depth, result) => {

      // console.log("REUS : " , result)
      for (const value of result.slice(id)) {
        if (value.depth < depth) {
          return true;
        }
        if (value.depth === depth) {
          return false;
        }
      }
      return true;
    },
    [githubTree]
  );

  const parentsLastStatus = (depth, id, result) => {
    const results = [];
    let findDepth = depth - 1;
    for (let i = id - 2; i >= 0; i--) {
      if (result[i].depth === findDepth) {
        findDepth--;
        results.push(isLast(result[i].id, result[i].depth, result));
      }
    }
    return results.reverse();
  }

  const calculateDepthIndicator = (id, depth, result) => {
    return (
      parentsLastStatus(depth, id, result).map((isLast) => (isLast ? '   ' : '│  ')).join('') +
      (isLast(id, depth, result) ? '└─ ' : '├─ ')
    );
  }

  const generateMermaidCode = async (resultData, repo) => {
    
    const toastId = toast.loading("Diagram Loading ...");
    try {
      const apiResult = await flowchartCodeApi(resultData, repo);
      setMermaidCode(apiResult);
      toast.success("Diagram Loaded!", { id: toastId })
    } catch (error) {
      toast.error("Diagram Loading Failed!", { id: toastId });
      setApiError("Diagram Loading Failed! Please try again");
    }
  }

  const findDepthIndicator = async (result, repoPath) => {

    const resultData = result.map((content, index) => {

      return {
        ...content, depthIndicator: calculateDepthIndicator(content.id, content.depth, result)
      }
    });

    
    const repo = (repoUrl.split('https://github.com/').reverse()[0]).split("/").reverse()[0];

    await generateMermaidCode(repoPath, repo);

    setGtihubTree(resultData);
    setRepoName(repo);
    setIsLoading(false);
  }

  const apiCall = async (githubUrl) => {
    let { data } = await axios.get(githubUrl);

    const result = data.tree.map((content, index) => {
      const depth = content.path.split('/');
      const textIndex = depth.length;
      return {
        id: index + 1,
        depth: textIndex,
        text: depth[textIndex - 1],
        depthIndicator: '',
      };
    });

    const repoPath = data.tree.map((repo) => repo.path)

    // console.log("DATA : " , repoPath)

    await findDepthIndicator(result , repoPath);
    scrollToSection(contentRef)
    // setGtihubTree(result);

  }

  const handleUrlSubmit = async () => {
    if (!repoUrl.trim()) return;

    setIsLoading(true);
    const toastId = toast.loading("Repository Tree Structure Loading ...");
    try {
      await apiCall(`https://api.github.com/repos/${repoUrl.split('https://github.com/').reverse()[0]}/git/trees/${branchName}?recursive=1`);
      toast.success("Repository Tree Structure Loaded!", { id: toastId });

    } catch (error) {
      toast.error("Error Occur From Github Side Repository Tree Structure Loading Failed!", { id: toastId });
    }
    setIsLoading(false)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">


      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
              Transform Repositories
              <br />
              <span className="text-slate-600">into Clear Diagrams</span>
            </h1>

            <div className="w-24 h-1 bg-slate-800 mx-auto mb-8"></div>

            <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-light leading-relaxed mb-4">
              A professional tool for converting GitHub repositories into comprehensive visual diagrams
              that enhance code understanding and documentation.
            </p>

            <p className="text-md text-slate-600 max-w-2xl mx-auto">
              Perfect for developers, architects, and teams who value clear code visualization.
            </p>
          </div>

          <div className="flex items-center justify-center mb-12">
            <div className="flex-grow h-px bg-slate-300"></div>
            <div className="mx-4">
              <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-grow h-px bg-slate-300"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Github className="h-6 w-6 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-800">Repository URL</h2>
              </div>
              <p className="text-slate-600 mt-2">Enter your GitHub repository URL to generate a visual diagram</p>
            </div>

            <div className="px-8 py-10">
              <div className="space-y-6">

                <div className='max-[850px]:flex-col sm:flex gap-x-2 space-y-6 justify-center'>
                  
                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      GitHub Repository URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        className="w-full px-4 py-4 text-lg border-2 border-slate-300 rounded-xl bg-white focus:border-slate-500 focus:ring-0 focus:outline-none transition-colors placeholder:text-slate-400"
                        placeholder="https://github.com/username/repository-name"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                      <div className='hidden min-[600px]:flex'>
                        <Github className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                   
                  </div>

                  <div className='min-[850px]:w-[15%]'> 
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Branch Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-4 text-lg border-2 border-slate-300 rounded-xl bg-white focus:border-slate-500 focus:ring-0 focus:outline-none transition-colors placeholder:text-slate-400"
                        placeholder={"Branch Name"}
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                      />
                    </div>
                    
                  </div>

                </div>

                <p className="text-sm text-slate-500 mt-2">
                  Make sure the repository is public or you have access permissions
                </p>

                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleUrlSubmit}
                    disabled={isLoading || !repoUrl.trim()}
                    className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${isLoading || !repoUrl.trim()
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Repository...
                      </>
                    ) : (
                      <>
                        Generate Diagram
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div ref={contentRef}>
          <TreeStructure treesData={githubTree} setTreesData={setGtihubTree} repoName={repoName} />
          <FlowChart mermaidCode={mermaidCode} apiError={apiError} loading={isLoading} />
        </div>



        <div className="grid md:grid-cols-3 gap-8 mb-16">

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
              <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Clear Visualization</h3>
            <p className="text-slate-600">Transform complex repository structures into easy-to-understand visual diagrams.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
              <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Code Analysis</h3>
            <p className="text-slate-600">Intelligent parsing of repository structure with support for multiple programming languages.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
              <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Professional Output</h3>
            <p className="text-slate-600">Generate clean, professional diagrams suitable for documentation and presentations.</p>
          </div>

        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Enter Repository URL</h3>
                <p className="text-slate-600">Paste your GitHub repository URL in the input field above.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Generate Diagram</h3>
                <p className="text-slate-600">Click the generate button to analyze and process your repository.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">View & Export</h3>
                <p className="text-slate-600">Explore your interactive diagram and export it for documentation.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full border border-blue-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Pro Tip: You can replace 'hub' with 'diagram' in any GitHub URL</span>
          </div>
        </div>


      </main>


    </div>
  );
}