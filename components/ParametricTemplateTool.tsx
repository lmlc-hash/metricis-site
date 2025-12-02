import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CodeIcon, ShieldIcon } from './icons/Icons';

interface ParametricTemplateToolProps {
  onBack: () => void;
}

// --- Comprehensive Parametric Schema ---
interface ParametricConfig {
  // 1. Size & Layout
  width: number;
  height: number;
  unit: 'mm' | 'in' | 'px';
  orientation: 'Portrait' | 'Landscape' | 'Square';
  bleed: number;
  margin: number;
  
  // 2. Print & Color
  outputMethod: 'Digital' | 'Offset' | 'Large Format' | 'Screen';
  dpi: number;
  colorMode: 'CMYK' | 'RGB' | 'Pantone';
  substrate: string; // e.g., "Coated Paper", "Vinyl"

  // 3. Grid & Typo
  columns: number;
  gutter: number;
  primaryFont: string;
  secondaryFont: string;

  // 4. Branding
  primaryColor: string; // Hex
  logoPlacement: 'Top-Right' | 'Center' | 'Bottom-Right' | 'Corner';

  // 5. Export
  fileFormat: 'PDF/X-1a' | 'PDF/X-4' | 'JPG' | 'PNG' | 'AI';
  includeMarks: boolean;
}

// Default State
const DEFAULT_CONFIG: ParametricConfig = {
  width: 210, height: 297, unit: 'mm', orientation: 'Portrait', bleed: 3, margin: 15,
  outputMethod: 'Digital', dpi: 300, colorMode: 'CMYK', substrate: 'Matte Paper',
  columns: 3, gutter: 5, primaryFont: 'Inter', secondaryFont: 'EB Garamond',
  primaryColor: '#0090DA', logoPlacement: 'Bottom-Right',
  fileFormat: 'PDF/X-4', includeMarks: true
};

// Moved components outside to prevent re-creation on render
const InputGroup: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <div className="mb-6">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      {children}
  </div>
);

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, label, icon }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            isActive 
            ? 'border-primary text-primary bg-primary/5' 
            : 'border-transparent text-gray-500 hover:text-secondary hover:bg-gray-50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const ParametricTemplateTool: React.FC<ParametricTemplateToolProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ParametricConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'layout' | 'print' | 'grid' | 'brand' | 'export'>('layout');
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // --- AI Auto-Configuration ---
  const handleAutoConfigure = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAiMessage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        You are an expert Print Production Manager. 
        Analyze the user's project description and generate a precise JSON configuration for a design template.
        Apply industry standards (e.g., 3mm bleed for print, 0mm for screen, 300DPI for print, 72 for web).
        Infer missing details based on the context (e.g., "Business Card" implies 90x50mm or 3.5x2in).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
              unit: { type: Type.STRING, enum: ['mm', 'in', 'px'] },
              orientation: { type: Type.STRING, enum: ['Portrait', 'Landscape', 'Square'] },
              bleed: { type: Type.NUMBER },
              margin: { type: Type.NUMBER },
              outputMethod: { type: Type.STRING, enum: ['Digital', 'Offset', 'Large Format', 'Screen'] },
              dpi: { type: Type.NUMBER },
              colorMode: { type: Type.STRING, enum: ['CMYK', 'RGB', 'Pantone'] },
              substrate: { type: Type.STRING },
              columns: { type: Type.NUMBER },
              gutter: { type: Type.NUMBER },
              primaryFont: { type: Type.STRING },
              secondaryFont: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              logoPlacement: { type: Type.STRING, enum: ['Top-Right', 'Center', 'Bottom-Right', 'Corner'] },
              fileFormat: { type: Type.STRING, enum: ['PDF/X-1a', 'PDF/X-4', 'JPG', 'PNG', 'AI'] },
              includeMarks: { type: Type.BOOLEAN },
              reasoning: { type: Type.STRING, description: "Short explanation of why these specs were chosen." }
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const result = JSON.parse(text);
        const { reasoning, ...newConfig } = result;
        setConfig(prev => ({ ...prev, ...newConfig }));
        setAiMessage(reasoning || "Configuration generated based on industry standards.");
      }
    } catch (error) {
      console.error(error);
      setAiMessage("Failed to auto-configure. Please try describing your project differently.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Typed update function using Generics for type safety
  const update = <K extends keyof ParametricConfig>(key: K, value: ParametricConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[800px] flex flex-col animate-fade-in-up">
      
      {/* 1. Header & Navigation */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl">
         <div>
            <button onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-secondary mb-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                DASHBOARD
            </button>
            <h2 className="text-2xl font-bold text-secondary font-serif">Parametric Spec Engine</h2>
         </div>
         <div className="bg-gray-100 text-xs font-mono px-3 py-1 rounded text-gray-500">
            v2.4.0
         </div>
      </div>

      {/* 2. AI Input Area */}
      <div className="p-8 bg-surface border-b border-gray-200">
        <label className="block text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            Start with a Description
        </label>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'A5 Flyer for a summer music festival, offset print on glossy paper'" 
                    className="w-full pl-5 pr-12 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleAutoConfigure()}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CodeIcon />
                </div>
            </div>
            <button 
                onClick={handleAutoConfigure}
                disabled={isGenerating || !prompt}
                className="bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary transition-all shadow-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[180px]"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Thinking...
                    </>
                ) : (
                    'Auto-Configure'
                )}
            </button>
        </div>
        {aiMessage && (
            <div className="mt-4 flex items-start text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in-up">
                <svg className="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>{aiMessage}</p>
            </div>
        )}
      </div>

      {/* 3. Main Content Area */}
      <div className="flex flex-grow flex-col lg:flex-row">
        
        {/* Left: Tabbed Editor */}
        <div className="w-full lg:w-2/3 flex flex-col border-r border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto bg-white">
                <TabButton isActive={activeTab === 'layout'} onClick={() => setActiveTab('layout')} label="Layout & Size" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>} />
                <TabButton isActive={activeTab === 'print'} onClick={() => setActiveTab('print')} label="Print Specs" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>} />
                <TabButton isActive={activeTab === 'grid'} onClick={() => setActiveTab('grid')} label="Grid & Typo" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
                <TabButton isActive={activeTab === 'brand'} onClick={() => setActiveTab('brand')} label="Branding" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>} />
                <TabButton isActive={activeTab === 'export'} onClick={() => setActiveTab('export')} label="Export" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>} />
            </div>

            {/* Config Form */}
            <div className="p-8 bg-gray-50 flex-grow overflow-y-auto">
                {activeTab === 'layout' && (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                        <InputGroup label="Width">
                            <div className="relative">
                                <input type="number" value={config.width} onChange={(e) => update('width', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                                <span className="absolute right-3 top-3 text-gray-400 text-sm">{config.unit}</span>
                            </div>
                        </InputGroup>
                        <InputGroup label="Height">
                            <div className="relative">
                                <input type="number" value={config.height} onChange={(e) => update('height', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                                <span className="absolute right-3 top-3 text-gray-400 text-sm">{config.unit}</span>
                            </div>
                        </InputGroup>
                        <InputGroup label="Unit">
                            <select value={config.unit} onChange={(e) => update('unit', e.target.value as any)} className="w-full p-3 rounded border border-gray-300">
                                <option value="mm">Millimeters</option>
                                <option value="in">Inches</option>
                                <option value="px">Pixels</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Orientation">
                             <div className="flex bg-white rounded border border-gray-300 p-1">
                                {['Portrait', 'Landscape', 'Square'].map(o => (
                                    <button 
                                        key={o}
                                        onClick={() => update('orientation', o as any)} 
                                        className={`flex-1 py-2 text-sm font-medium rounded ${config.orientation === o ? 'bg-secondary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {o}
                                    </button>
                                ))}
                             </div>
                        </InputGroup>
                        <InputGroup label="Bleed">
                            <div className="relative">
                                <input type="number" value={config.bleed} onChange={(e) => update('bleed', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                                <span className="absolute right-3 top-3 text-gray-400 text-sm">{config.unit}</span>
                            </div>
                        </InputGroup>
                        <InputGroup label="Margin">
                            <div className="relative">
                                <input type="number" value={config.margin} onChange={(e) => update('margin', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                                <span className="absolute right-3 top-3 text-gray-400 text-sm">{config.unit}</span>
                            </div>
                        </InputGroup>
                    </div>
                )}

                {activeTab === 'print' && (
                     <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                        <InputGroup label="Output Method">
                            <select value={config.outputMethod} onChange={(e) => update('outputMethod', e.target.value as any)} className="w-full p-3 rounded border border-gray-300">
                                <option>Digital</option>
                                <option>Offset</option>
                                <option>Large Format</option>
                                <option>Screen</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Resolution (DPI)">
                            <input type="number" value={config.dpi} onChange={(e) => update('dpi', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                        <InputGroup label="Color Mode">
                             <select value={config.colorMode} onChange={(e) => update('colorMode', e.target.value as any)} className="w-full p-3 rounded border border-gray-300">
                                <option>CMYK</option>
                                <option>RGB</option>
                                <option>Pantone</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Substrate / Paper">
                            <input type="text" value={config.substrate} onChange={(e) => update('substrate', e.target.value)} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                     </div>
                )}

                {activeTab === 'grid' && (
                     <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                         <InputGroup label="Columns">
                            <input type="number" value={config.columns} onChange={(e) => update('columns', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                        <InputGroup label="Gutter">
                            <input type="number" value={config.gutter} onChange={(e) => update('gutter', Number(e.target.value))} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                        <InputGroup label="Primary Font">
                            <input type="text" value={config.primaryFont} onChange={(e) => update('primaryFont', e.target.value)} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                         <InputGroup label="Secondary Font">
                            <input type="text" value={config.secondaryFont} onChange={(e) => update('secondaryFont', e.target.value)} className="w-full p-3 rounded border border-gray-300" />
                        </InputGroup>
                     </div>
                )}

                {activeTab === 'brand' && (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                        <InputGroup label="Primary Color">
                            <div className="flex items-center space-x-2">
                                <input type="color" value={config.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="w-12 h-12 p-1 rounded border border-gray-300 cursor-pointer" />
                                <input type="text" value={config.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} className="flex-grow p-3 rounded border border-gray-300 font-mono" />
                            </div>
                        </InputGroup>
                        <InputGroup label="Logo Placement">
                            <select value={config.logoPlacement} onChange={(e) => update('logoPlacement', e.target.value as any)} className="w-full p-3 rounded border border-gray-300">
                                <option>Top-Right</option>
                                <option>Center</option>
                                <option>Bottom-Right</option>
                                <option>Corner</option>
                            </select>
                        </InputGroup>
                    </div>
                )}

                 {activeTab === 'export' && (
                    <div className="grid grid-cols-2 gap-6 animate-fade-in-up">
                        <InputGroup label="File Format">
                             <select value={config.fileFormat} onChange={(e) => update('fileFormat', e.target.value as any)} className="w-full p-3 rounded border border-gray-300">
                                <option>PDF/X-4</option>
                                <option>PDF/X-1a</option>
                                <option>AI</option>
                                <option>JPG</option>
                                <option>PNG</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Printer Marks">
                            <div className="flex items-center h-full">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={config.includeMarks} onChange={(e) => update('includeMarks', e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded" />
                                    <span className="text-secondary font-medium">Include Crop & Bleed Marks</span>
                                </label>
                            </div>
                        </InputGroup>
                    </div>
                )}
            </div>
        </div>

        {/* Right: Preview & Code */}
        <div className="w-full lg:w-1/3 bg-gray-900 text-gray-300 p-8 overflow-y-auto flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center">
                    <ShieldIcon /> <span className="ml-2">Live Specs</span>
                </h3>
                <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-green-400">JSON READY</span>
            </div>
            
            {/* Visual Abstract Preview (Simple CSS rep) */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6 flex items-center justify-center min-h-[200px] border border-gray-700 relative overflow-hidden">
                 <div 
                    className="bg-white shadow-lg transition-all duration-500 relative"
                    style={{
                        width: config.orientation === 'Landscape' ? '160px' : config.orientation === 'Square' ? '120px' : '100px',
                        height: config.orientation === 'Landscape' ? '100px' : config.orientation === 'Square' ? '120px' : '160px',
                        borderColor: config.primaryColor,
                        borderWidth: '2px',
                    }}
                 >
                    {/* Simulated Content */}
                    <div className="absolute top-2 left-2 right-2 h-2 bg-gray-100 rounded-sm"></div>
                    <div className="absolute top-5 left-2 right-2 bottom-8 bg-gray-50 rounded-sm">
                        {config.columns > 1 && (
                            <div className="flex h-full gap-1 p-1">
                                {Array.from({length: Math.min(config.columns, 4)}).map((_, i) => (
                                    <div key={i} className="flex-1 bg-red-100/20 border border-red-200/50"></div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Simulated Logo */}
                    <div 
                        className={`absolute w-6 h-6 rounded-full bg-current opacity-80`}
                        style={{
                            color: config.primaryColor,
                            top: config.logoPlacement.includes('Top') ? '8px' : 'auto',
                            bottom: config.logoPlacement.includes('Bottom') ? '8px' : 'auto',
                            left: config.logoPlacement.includes('Center') ? '50%' : config.logoPlacement === 'Corner' ? '8px' : 'auto',
                            right: config.logoPlacement.includes('Right') ? '8px' : config.logoPlacement === 'Corner' ? 'auto' : 'auto',
                            transform: config.logoPlacement.includes('Center') ? 'translateX(-50%)' : 'none'
                        }}
                    ></div>
                 </div>
                 
                 {/* Bleed Guide */}
                 <div className="absolute inset-0 pointer-events-none border border-red-500/30 m-2 border-dashed flex items-end justify-end p-1">
                    <span className="text-[10px] text-red-500/50">Bleed: {config.bleed}{config.unit}</span>
                 </div>
            </div>

            <div className="flex-grow font-mono text-xs overflow-auto bg-black/30 p-4 rounded-xl border border-gray-700">
                <pre>{JSON.stringify(config, null, 2)}</pre>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
                <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-500 transition-all shadow-lg flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Parameters
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParametricTemplateTool;