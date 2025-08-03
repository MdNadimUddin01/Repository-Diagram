import React, { useCallback, useEffect, useMemo } from 'react'

export function Tree({ treeData, treesData, setTreesData }) {
    const {text ,depthIndicator } = treeData;

   
    return (
        <div className='font-[monospace] whitespace-pre leading-1'>
            <span className='text-lg text-[#666]'>{depthIndicator}</span>
            <span>{text}</span>
        </div>
    );
}
