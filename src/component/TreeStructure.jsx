import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tree } from './Tree'
import Clipboard from "clipboard"

export function TreeStructure({ treesData, repoName, setTreesData }) {
    
    const [copyClicked, setCopyClicked] = useState(false);
    const buttonRef = useRef();
    
    
    return (

        <div className='p-5'>

            <div>
                <h1 className="my-4 text-slate-800 text-2xl font-bold">
                    📦 Project Structure Tree
                </h1>
            </div>

            <div className='flex items-center justify-center '>

                <div className='overflow-scroll relative w-full h-[600px] bg-[#f6f8fa] rounded-[6px]'>
                    <div className='flex justify-between'>
                        <input placeholder='Root Folder Name' value={repoName} onChange={(e) => { }} />
                        
                        <button
                            ref={buttonRef}
                            className={`clip-button cursor-pointer ${copyClicked ? 'success' : ''} p-2`}
                            data-clipboard-text={
                                '```\n' +
                                `📦 ${repoName}\n` +
                                treesData.map(({ depthIndicator, text }) => depthIndicator + text).join('\n') +
                                '\n```' 
                            }
                            onClick={() => {
                                setCopyClicked(true);
                                setTimeout(() => {
                                    setCopyClicked(false);
                                }, 1000);
                            }}
                            
                        >
                            {copyClicked ? "✅" : "📋"}
                        </button>
                    </div>
                    <div className='-space-y-2'>
                        {
                            treesData.map((treeData) => (
                                <Tree
                                    key={treeData.id}
                                    treesData={treesData}
                                    treeData={treeData}
                                    setTreesData={setTreesData}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}

