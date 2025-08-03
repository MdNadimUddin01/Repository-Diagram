import { Expand, Shrink } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export const FlowChart = ({ mermaidCode, apiError, loading }) => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const [fitScreen, setFitScreen] = useState(false)

    const renderChart = async () => {
        if (!chartRef.current || !mermaidCode) return;

        try {
            setIsLoading(true);
            setIsError(false);

            chartRef.current.innerHTML = '';

            if (!window.mermaid) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js';

                script.onload = () => {
                    initializeAndRender();
                };

                script.onerror = () => {
                    setIsError(true);
                    setIsLoading(false);
                    chartRef.current.innerHTML = `
            <div class="text-red-600 p-5 text-center border border-red-600 rounded-lg bg-red-50">
              <strong>Error:</strong> Failed to load  
            </div>
          `;
                };

                document.head.appendChild(script);
            } else {
                initializeAndRender();
            }

        } catch (error) {
            setIsError(true);
            setIsLoading(false);
            console.error('Rendering error:', error);
        }
    };

    const initializeAndRender = () => {

        if (!mermaidCode) return;

        try {
            window.mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true,
                    curve: 'basis'
                }
            });

            const id = `mermaid-${Date.now()}`;

            window.mermaid.render(id, mermaidCode)
                .then(({ svg }) => {
                    if (chartRef.current) {
                        chartRef.current.innerHTML = svg;
                        setIsLoading(false);

                        const svgElement = chartRef.current.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
                            svgElement.style.transformOrigin = '0 0';
                            svgElement.style.transition = 'transform 0.1s ease-out';
                        }
                    }
                })
                .catch((error) => {
                    // console.error(' render error:', error);
                    setIsError(true);
                    setIsLoading(false);
                    if (chartRef.current) {
                        chartRef.current.innerHTML = `
              <div class="text-red-600 p-5 text-center border border-red-600 rounded-lg bg-red-50">
                <strong>Error:</strong> Failed to render diagram Please try again
              </div>
            `;
                    }
                });
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
            // console.error('Initialize error:', error);
        }

    };

    const handleZoom = (delta, clientX, clientY) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const containerX = clientX - rect.left;
        const containerY = clientY - rect.top;

        const scaleFactor = delta > 0 ? 1.1 : 0.9;
        const newScale = Math.max(0.1, Math.min(3, transform.scale * scaleFactor));

        if (newScale !== transform.scale) {
            const newX = containerX - (containerX - transform.x) * (newScale / transform.scale);
            const newY = containerY - (containerY - transform.y) * (newScale / transform.scale);

            const newTransform = { x: newX, y: newY, scale: newScale };
            setTransform(newTransform);
            setZoomLevel(Math.round(newScale * 100));

            const svgElement = chartRef.current?.querySelector('svg');
            if (svgElement) {
                svgElement.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale})`;
            }
        }
    };

    const handleWheel = (e) => {
        handleZoom(-e.deltaY, e.clientX, e.clientY);
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) { 
            setIsDragging(true);
            setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            const newTransform = { ...transform, x: newX, y: newY };
            setTransform(newTransform);

            const svgElement = chartRef.current?.querySelector('svg');
            if (svgElement) {
                svgElement.style.transform = `translate(${newX}px, ${newY}px) scale(${transform.scale})`;
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const zoomIn = () => {
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            handleZoom(1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    };

    const zoomOut = () => {
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            handleZoom(-1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    };

    const resetZoom = () => {
        const newTransform = { x: 0, y: 0, scale: 1 };
        setTransform(newTransform);
        setZoomLevel(100);

        const svgElement = chartRef.current?.querySelector('svg');
        if (svgElement) {
            svgElement.style.transform = `translate(0px, 0px) scale(1)`;
        }
    };

    const fitToScreen = () => {
        const container = containerRef.current;
        const svgElement = chartRef.current?.querySelector('svg');

        if (container && svgElement) {
            const containerRect = container.getBoundingClientRect();
            const svgRect = svgElement.getBoundingClientRect();

            const scaleX = (containerRect.width - 40) / svgRect.width;
            const scaleY = (containerRect.height - 40) / svgRect.height;
            const newScale = Math.min(scaleX, scaleY, 1);

            const newX = (containerRect.width - svgRect.width * newScale) / 2;
            const newY = (containerRect.height - svgRect.height * newScale) / 2;

            const newTransform = { x: newX, y: newY, scale: newScale };
            setTransform(newTransform);
            setZoomLevel(Math.round(newScale * 100));

            svgElement.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale})`;
        }
    };

    useEffect(() => {
        renderChart();
    }, [mermaidCode]);

    useEffect(() => {
        const handleGlobalMouseMove = (e) => handleMouseMove(e);
        const handleGlobalMouseUp = () => handleMouseUp();

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, dragStart, transform]);

    const downloadSVG = () => {
        const svgElement = chartRef.current?.querySelector('svg');
        if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'project-structure.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(svgUrl);
        }
    };

    return (
        <div className={`font-sans overflow-hidden p-5 ${fitScreen ? "fixed inset-0 z-50 min-h-screen min-w-screen bg-white" : ""}`}
            role={`${fitScreen ? "dialog" : ""}`}
            aria-modal={`${fitScreen ? "true" : "false"} `}
            aria-labelledby={`${fitScreen ? "modalTitle" : ""} `}
        >
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2 ">
                <div>
                    <h1 className="m-0 text-slate-800 text-2xl font-bold">
                        📦 Project Structure Diagram
                    </h1>

                </div>

                <div className="flex gap-2 items-center flex-wrap">

                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                        <button
                            onClick={zoomOut}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm font-mono"
                            title="Zoom Out"
                        >
                            −
                        </button>
                        <span className="px-2 py-1 text-xs font-mono text-gray-600 min-w-[50px] text-center">
                            {zoomLevel}%
                        </span>
                        <button
                            onClick={zoomIn}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm font-mono"
                            title="Zoom In"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => setFitScreen(prev => !prev)}
                        className="px-3 py-2 bg-gray-500 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                        {!fitScreen ? <Expand className='h-5 w-5' /> : <Shrink className='h-5 w-5' />}
                    </button>

                    <button
                        onClick={resetZoom}
                        className="px-3 py-2 bg-gray-500 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-gray-600 transition-colors"
                        title="Reset Zoom"
                    >
                        🔄 Reset
                    </button>

                    <button
                        onClick={fitToScreen}
                        className="px-3 py-2 bg-green-500 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-green-600 transition-colors"
                        title="Fit to Screen"
                    >
                        📐 Fit
                    </button>



                    {!isLoading && !isError && (
                        <button
                            onClick={downloadSVG}
                            className="px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                            📥 Download SVG
                        </button>
                    )}

                </div>
            </div>

            {isLoading && (
                <div className="text-center py-10 text-slate-500">
                    <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-2">Loading diagram...</p>
                </div>
            )}

            {mermaidCode &&
                <div
                    ref={containerRef}
                    className={`relative w-full bg-gray-50  rounded-lg border border-gray-200 overflow-hidden ${isLoading ? 'min-h-96' : 'h-[600px]'
                        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${fitScreen ? "fixed inset-0 z-50 min-h-screen min-w-screen" : ""}`}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    style={{ userSelect: 'none' }}
                >
                    <div
                        ref={chartRef}
                        className="absolute top-0 left-0 w-full h-full"
                    />

                    {!isLoading && !isError && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded pointer-events-none">
                            💡 Scroll to zoom • Drag to pan
                        </div>
                    )}

                </div>}

            {
                (!mermaidCode || apiError || loading) && <div className="text-red-600 p-5 text-center border border-red-600 rounded-lg bg-red-50">
                    {apiError ?? loading ? "Diagram is Loading ..." : "Enter the github Url"}
                </div>
            }

        </div>
    );
};

