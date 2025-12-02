import React, { useState } from 'react';

interface TemplateGalleryProps {
    showPersonal?: boolean;
}

// Extended Mock Data with new parameters and cover images
const TEMPLATES = [
    { 
        id: 1, 
        title: 'Minimalist Instagram Set', 
        projectType: 'Social Media', 
        fileType: 'PSD', 
        palette: 'Monochrome', 
        primaryTypo: 'Sans Serif', 
        secondaryTypo: 'Serif', 
        borders: 'None',
        imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 2, 
        title: 'Corporate Branding Kit', 
        projectType: 'Branding', 
        fileType: 'AI', 
        palette: 'Cool', 
        primaryTypo: 'Serif', 
        secondaryTypo: 'Sans Serif', 
        borders: 'Sharp',
        imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 3, 
        title: 'Event Poster Series', 
        projectType: 'Print', 
        fileType: 'INDD', 
        palette: 'Vibrant', 
        primaryTypo: 'Display', 
        secondaryTypo: 'Sans Serif', 
        borders: 'None',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 4, 
        title: 'Tech Startup Pitch', 
        projectType: 'Presentation', 
        fileType: 'PDF', 
        palette: 'Modern', 
        primaryTypo: 'Sans Serif', 
        secondaryTypo: 'Mono', 
        borders: 'Rounded',
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 5, 
        title: 'Editorial Lookbook', 
        projectType: 'Diagramação', 
        fileType: 'INDD', 
        palette: 'Pastel', 
        primaryTypo: 'Serif', 
        secondaryTypo: 'Serif', 
        borders: 'Soft',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 6, 
        title: 'Daily Stories Pack', 
        projectType: 'Social Media', 
        fileType: 'PNG', 
        palette: 'Warm', 
        primaryTypo: 'Script', 
        secondaryTypo: 'Sans Serif', 
        borders: 'Rounded',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
];

// Mock Data for User's Created Folders
const USER_FOLDERS = [
    { id: 101, name: 'Q3 Marketing Assets', items: 12, date: '2 days ago', color: 'bg-primary' },
    { id: 102, name: 'Client: EcoStyle', items: 8, date: '1 week ago', color: 'bg-accent-pink' },
    { id: 103, name: 'Personal Portfolio', items: 4, date: '3 weeks ago', color: 'bg-accent-yellow' },
];

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2.06 11L15 10h2v7h.94z" opacity=".3"/>
        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
    </svg>
);

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ showPersonal = false }) => {
    // State for all filters
    const [projectType, setProjectType] = useState('All');
    const [fileType, setFileType] = useState('All');
    const [palette, setPalette] = useState('All');
    const [primaryTypo, setPrimaryTypo] = useState('All');
    const [secondaryTypo, setSecondaryTypo] = useState('All');
    const [borders, setBorders] = useState('All');

    // Filter Logic
    const filteredTemplates = TEMPLATES.filter(t => {
        return (projectType === 'All' || t.projectType === projectType) &&
               (fileType === 'All' || t.fileType === fileType) &&
               (palette === 'All' || t.palette === palette) &&
               (primaryTypo === 'All' || t.primaryTypo === primaryTypo) &&
               (secondaryTypo === 'All' || t.secondaryTypo === secondaryTypo) &&
               (borders === 'All' || t.borders === borders);
    });

    const resetFilters = () => {
        setProjectType('All');
        setFileType('All');
        setPalette('All');
        setPrimaryTypo('All');
        setSecondaryTypo('All');
        setBorders('All');
    };

    // Helper to render select inputs
    const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (val: string) => void, options: string[] }) => (
        <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
            <div className="relative">
                <select 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-secondary py-2 px-3 pr-8 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition-colors cursor-pointer"
                >
                    <option value="All">All {label}s</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
    );

    return (
        <section id="gallery" className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-6">
                
                {/* --- SECTION 1: MY COLLECTIONS (FOLDERS) - Authenticated Only --- */}
                {showPersonal && (
                    <div className="mb-20">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-4xl font-bold text-secondary font-serif">My Collections</h2>
                                <p className="text-gray-600 mt-2">Access your generated templates and saved projects.</p>
                            </div>
                            <button className="bg-white border-2 border-dashed border-gray-300 text-secondary px-5 py-2 rounded-xl font-bold hover:border-primary hover:text-primary transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Collection
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {USER_FOLDERS.map(folder => (
                                <div key={folder.id} className="bg-surface rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${folder.color}`}></div>
                                    <div className="text-secondary/20 mb-4 group-hover:text-secondary/40 transition-colors">
                                        <FolderIcon />
                                    </div>
                                    <h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-primary transition-colors">{folder.name}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                                        <span>{folder.items} Files</span>
                                        <span>{folder.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-px bg-gray-100 mt-20"></div>
                    </div>
                )}


                {/* --- SECTION 2: PUBLIC GALLERY --- */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6 font-serif">Browse Global Library</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Find the perfect starting point. Filter by format, typography, or visual style.
                    </p>
                </div>

                {/* Main Filter Container */}
                <div className="bg-surface rounded-2xl p-8 mb-12 border border-gray-200 shadow-sm">
                    
                    {/* Level 1: Project Type (Tabs) */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Social Media', 'Branding', 'Presentation', 'Print', 'Diagramação'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setProjectType(type)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                        projectType === type 
                                        ? 'bg-secondary text-white shadow-md' 
                                        : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full mb-8"></div>

                    {/* Level 2: Detailed Parameters (Grid) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        <FilterSelect 
                            label="File Type" 
                            value={fileType} 
                            onChange={setFileType} 
                            options={['PSD', 'AI', 'INDD', 'PDF', 'PNG']} 
                        />
                         <FilterSelect 
                            label="Color Palette" 
                            value={palette} 
                            onChange={setPalette} 
                            options={['Monochrome', 'Cool', 'Warm', 'Vibrant', 'Pastel', 'Modern']} 
                        />
                         <FilterSelect 
                            label="Primary Typo" 
                            value={primaryTypo} 
                            onChange={setPrimaryTypo} 
                            options={['Serif', 'Sans Serif', 'Display', 'Script']} 
                        />
                        <FilterSelect 
                            label="Secondary Typo" 
                            value={secondaryTypo} 
                            onChange={setSecondaryTypo} 
                            options={['Serif', 'Sans Serif', 'Mono']} 
                        />
                         <FilterSelect 
                            label="Borders" 
                            value={borders} 
                            onChange={setBorders} 
                            options={['None', 'Rounded', 'Sharp', 'Soft']} 
                        />
                    </div>
                    
                    {/* Active Filter Summary / Reset */}
                    {(projectType !== 'All' || fileType !== 'All' || palette !== 'All' || primaryTypo !== 'All' || secondaryTypo !== 'All' || borders !== 'All') && (
                         <div className="mt-8 flex justify-end">
                            <button 
                                onClick={resetFilters}
                                className="text-sm text-accent-pink font-bold hover:underline flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear All Filters
                            </button>
                         </div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            {/* Visual Preview */}
                            <div className="h-64 relative overflow-hidden">
                                <img 
                                    src={template.imageUrl} 
                                    alt={template.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent flex items-end p-6">
                                     <div>
                                        <h4 className="text-2xl font-bold text-white mb-2 font-serif shadow-sm leading-tight">{template.title}</h4>
                                        <p className="text-xs text-gray-200 uppercase tracking-widest font-semibold flex items-center">
                                            <span className="w-2 h-2 bg-accent-pink rounded-full mr-2"></span>
                                            {template.fileType} • {template.palette}
                                        </p>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Info Card */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-primary bg-blue-50">
                                        {template.projectType}
                                    </span>
                                    {/* Action Icon placeholder */}
                                    <div className="text-gray-300 group-hover:text-primary transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 text-sm text-gray-500 mb-6 flex-grow">
                                    <div className="flex justify-between border-b border-gray-50 border-dashed pb-2">
                                        <span className="font-medium text-gray-400">Typography</span>
                                        <span className="text-secondary font-semibold text-right">{template.primaryTypo} + {template.secondaryTypo}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 border-dashed pb-2">
                                        <span className="font-medium text-gray-400">Border Style</span>
                                        <span className="text-secondary font-semibold text-right">{template.borders}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-white border border-secondary text-secondary rounded-lg font-bold hover:bg-secondary hover:text-white transition-colors flex items-center justify-center mt-auto">
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                     <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-2">No templates match your specific criteria.</p>
                        <p className="text-gray-400 text-sm">Try adjusting the typography or palette filters.</p>
                        <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-secondary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                            Reset Filters
                        </button>
                     </div>
                )}
            </div>
        </section>
    );
};

export default TemplateGallery;