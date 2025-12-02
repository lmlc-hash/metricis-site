
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface SmartCalendarToolProps {
  onBack: () => void;
}

interface CalendarEvent {
  date: string;
  title: string;
  description: string;
  type: string;
  assignedTo?: string; // Name of the team member
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string;
}

// Mock Data for existing calendars
interface ExistingProject {
    id: number;
    title: string;
    status: 'In Progress' | 'Completed' | 'Planning';
    dateRange: string;
    progress: number;
    members: string[]; // Initials
}

const MOCK_PROJECTS: ExistingProject[] = [
    { id: 1, title: 'Q3 Rebrand Identity', status: 'In Progress', dateRange: 'Oct 01 - Dec 15', progress: 65, members: ['JD', 'AL'] },
    { id: 2, title: 'Social Media Jan', status: 'Planning', dateRange: 'Jan 01 - Jan 31', progress: 10, members: ['JD'] },
    { id: 3, title: 'EcoStyle Launch', status: 'Completed', dateRange: 'Aug 15 - Sep 30', progress: 100, members: ['AL', 'MS', 'JD'] },
];

const AVATAR_COLORS = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

const SmartCalendarTool: React.FC<SmartCalendarToolProps> = ({ onBack }) => {
  // --- View State (List vs Wizard) ---
  const [view, setView] = useState<'list' | 'wizard'>('list');
  const [visualizationMode, setVisualizationMode] = useState<'timeline' | 'kanban' | 'calendar'>('timeline');

  // --- Wizard State ---
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // --- Data State ---
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Branding Identity');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Team State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const [fileQuantity, setFileQuantity] = useState('10');
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [contentInfo, setContentInfo] = useState('');
  
  const [palette, setPalette] = useState('');
  const [typography, setTypography] = useState('');
  const [graphicParams, setGraphicParams] = useState('');

  // --- System State ---
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<CalendarEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Helpers ---
  const handleFileTypeChange = (type: string) => {
    setFileTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const addTeamMember = () => {
    if (newMemberName && newMemberRole) {
      const color = AVATAR_COLORS[teamMembers.length % AVATAR_COLORS.length];
      setTeamMembers([...teamMembers, {
        id: Date.now().toString(),
        name: newMemberName,
        role: newMemberRole,
        email: newMemberEmail,
        color
      }]);
      setNewMemberName('');
      setNewMemberRole('');
      setNewMemberEmail('');
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const generateGoogleCalendarLink = (event: CalendarEvent) => {
    try {
        const dateObj = new Date(event.date);
        if (isNaN(dateObj.getTime())) return '#';

        const startTime = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
        // Default 1 hour duration
        const endTime = new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
        
        const details = `${event.description} \n\nType: ${event.type}`;
        const assignee = teamMembers.find(m => m.name === event.assignedTo);
        const guests = assignee ? assignee.email : '';

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&add=${encodeURIComponent(guests)}`;
    } catch (e) {
        console.error("Error generating link", e);
        return '#';
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const teamContext = teamMembers.map(m => `${m.name} (${m.role})`).join(', ');

      const prompt = `
      Act as a Senior Project Manager for a design studio. Create a detailed project schedule based on these parameters:
      
      PROJECT: ${projectName} (${projectType})
      DATES: ${startDate} to ${endDate}
      TEAM: ${teamContext || 'Assign to general Design Team'}
      DELIVERABLES: ${fileQuantity} assets. Formats: ${fileTypes.join(', ')}.
      CONTEXT: ${contentInfo}
      STYLE: Palette: ${palette}, Typo: ${typography}, Graphics: ${graphicParams}

      Generate a logical timeline. For each task, ASSIGN it to the most appropriate team member from the list provided based on their role.
      Return strictly a JSON array.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING, description: "Format YYYY-MM-DD" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                assignedTo: { type: Type.STRING, description: "Name of the team member assigned" }
              }
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text) as CalendarEvent[];
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setGeneratedPlan(data);
        nextStep(); // Go to results step
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate schedule. Please check your inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-10">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === i ? 'bg-secondary text-white scale-110 shadow-lg' : step > i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i}
            </div>
            {i < 4 && <div className={`w-10 h-1 mx-2 rounded ${step > i ? 'bg-primary' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>
    </div>
  );

  // --- Visualization Components ---

  const renderTimelineView = () => (
      <div className="space-y-6">
        {generatedPlan?.map((event, index) => {
            const assignee = teamMembers.find(m => m.name === event.assignedTo);
            const initials = getInitials(event.assignedTo || '');
            const color = assignee?.color || 'bg-gray-400';

            return (
                <div key={index} className="flex group">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-3 h-3 rounded-full bg-primary mb-1 shadow-sm"></div>
                        <div className="w-0.5 flex-grow bg-gray-100 group-last:hidden"></div>
                    </div>
                    <div className="bg-surface rounded-xl p-6 flex-grow border border-gray-100 hover:shadow-md transition-all hover:border-primary/30">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">{event.date}</span>
                                <h4 className="text-xl font-bold text-secondary font-serif">{event.title}</h4>
                                <p className="text-gray-500 mt-2 text-sm">{event.description}</p>
                                <span className="inline-block mt-3 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-medium">Type: {event.type}</span>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-3">
                                {/* Assignee Avatar */}
                                <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                                    <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-xs text-white font-bold`}>
                                        {initials}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 pr-1">{event.assignedTo || 'Unassigned'}</span>
                                </div>

                                {/* Status Badge (Mock) */}
                                <div className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Invite Sent
                                </div>
                                
                                {/* Add to Calendar Button */}
                                <a 
                                    href={generateGoogleCalendarLink(event)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold text-primary hover:text-secondary flex items-center transition-colors border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-blue-50"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Add to Calendar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
  );

  const renderKanbanView = () => {
    // Distribute for demo purposes
    const total = generatedPlan?.length || 0;
    const doneCount = Math.floor(total * 0.2); // First 20%
    const inProgressCount = Math.floor(total * 0.2); // Next 20%
    
    const finished = generatedPlan?.slice(0, doneCount) || [];
    const onIt = generatedPlan?.slice(doneCount, doneCount + inProgressCount) || [];
    const toDo = generatedPlan?.slice(doneCount + inProgressCount) || [];

    const KanbanColumn = ({ title, events, color }: { title: string, events: CalendarEvent[], color: string }) => (
        <div className="flex-1 bg-gray-50 rounded-xl p-4 min-h-[400px]">
            <div className={`flex items-center mb-4 pb-2 border-b border-gray-200`}>
                <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                <h4 className="font-bold text-secondary uppercase tracking-wider text-xs">{title} ({events.length})</h4>
            </div>
            <div className="space-y-3">
                {events.map((event, i) => {
                     const assignee = teamMembers.find(m => m.name === event.assignedTo);
                     const initials = getInitials(event.assignedTo || '');
                     const avatarColor = assignee?.color || 'bg-gray-400';
                    return (
                        <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                            <span className="text-[10px] font-bold text-gray-400 mb-1 block">{event.date}</span>
                            <h5 className="font-bold text-secondary text-sm mb-2 leading-tight">{event.title}</h5>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{event.type}</span>
                                <div className={`w-5 h-5 rounded-full ${avatarColor} flex items-center justify-center text-[8px] text-white font-bold`}>
                                    {initials}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            <KanbanColumn title="To Do" events={toDo} color="bg-gray-400" />
            <KanbanColumn title="On It" events={onIt} color="bg-primary" />
            <KanbanColumn title="Finished" events={finished} color="bg-green-500" />
        </div>
    );
  };

  const renderCalendarView = () => {
      // Simple month view based on start date
      const start = startDate ? new Date(startDate) : new Date();
      // Safety check if date is invalid
      if (isNaN(start.getTime())) {
          return <div className="text-center p-10 text-gray-500">Please select a valid start date to view the calendar.</div>
      }

      const monthName = start.toLocaleString('default', { month: 'long', year: 'numeric' });
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      const firstDay = new Date(start.getFullYear(), start.getMonth(), 1).getDay(); // 0 is Sunday
      
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const blanks = Array.from({ length: firstDay }, (_, i) => i);

      return (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 text-center">
                  <h3 className="font-bold text-lg text-secondary">{monthName}</h3>
              </div>
              <div className="grid grid-cols-7 text-center bg-gray-100 border-b border-gray-200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="py-2 text-xs font-bold text-gray-500 uppercase">{d}</div>
                  ))}
              </div>
              <div className="grid grid-cols-7 bg-gray-200 gap-px">
                  {blanks.map(b => <div key={`blank-${b}`} className="bg-white h-32"></div>)}
                  {days.map(d => {
                      const dateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      const daysEvents = generatedPlan?.filter(e => e.date === dateStr);
                      
                      return (
                          <div key={d} className="bg-white h-32 p-1 relative group hover:bg-blue-50 transition-colors">
                              <span className={`text-xs font-bold p-1 ${daysEvents?.length ? 'text-secondary' : 'text-gray-400'}`}>{d}</span>
                              <div className="mt-1 space-y-1 overflow-y-auto max-h-[90px]">
                                  {daysEvents?.map((e, i) => (
                                      <div key={i} className="text-[9px] bg-primary/10 text-primary p-1 rounded border border-primary/20 truncate" title={e.title}>
                                          {e.title}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  // --------------------------------------------------------------------------
  // VIEW: LIST (Dashboard)
  // --------------------------------------------------------------------------
  if (view === 'list') {
      return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[800px] flex flex-col p-8 relative overflow-hidden animate-fade-in-up">
             {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <div>
                    <button onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-secondary mb-1">← DASHBOARD</button>
                    <h2 className="text-3xl font-bold text-secondary font-serif">My Projects</h2>
                </div>
                <button 
                    onClick={() => setView('wizard')}
                    className="bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-primary transition-all flex items-center"
                >
                    <span className="text-xl mr-2">+</span> New Calendar
                </button>
            </div>

            {/* Grid of Projects */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map(project => (
                    <div key={project.id} className="bg-surface rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {project.status}
                            </span>
                            {/* Avatars */}
                            <div className="flex -space-x-2">
                                {project.members.map((initial, i) => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold bg-gray-400`}>
                                        {initial}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2 font-serif group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{project.dateRange}</p>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <div className="text-right text-xs text-gray-400 font-bold">{project.progress}% Complete</div>
                    </div>
                ))}

                {/* New Project Placeholder */}
                <div 
                    onClick={() => setView('wizard')}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold">+</span>
                    </div>
                    <span className="font-bold">Create New Project</span>
                </div>
            </div>
        </div>
      );
  }

  // --------------------------------------------------------------------------
  // VIEW: WIZARD
  // --------------------------------------------------------------------------
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[800px] flex flex-col relative overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
           <button onClick={() => setView('list')} className="text-xs font-bold text-gray-400 hover:text-secondary mb-1">← BACK TO LIST</button>
           <h2 className="text-2xl font-bold text-secondary font-serif">
              {step === 4 ? generatedPlan ? 'Project Dashboard' : 'Generating...' : 'New Project Wizard'}
           </h2>
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col">
        {renderStepIndicator()}

        {/* --- STEP 1: SCOPE & TEAM --- */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
             <h3 className="text-xl font-bold text-secondary mb-6 text-center">Project Scope & Team</h3>
             <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Name</label>
                        <input value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary" placeholder="e.g. Q4 Marketing Push" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Type</label>
                        <select value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                            <option>Branding Identity</option>
                            <option>Social Media Campaign</option>
                            <option>Website Design</option>
                            <option>Print Material</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
                    </div>
                </div>

                {/* Team Management */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-secondary mb-4 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Team Members
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                        {teamMembers.map(member => (
                            <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-xs`}>
                                        {getInitials(member.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-secondary">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role} • {member.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeTeamMember(member.id)} className="text-gray-400 hover:text-red-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        {teamMembers.length === 0 && <p className="text-sm text-gray-400 italic">No members added yet.</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <input placeholder="Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="text-sm p-2 rounded border border-gray-300" />
                        <select value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} className="text-sm p-2 rounded border border-gray-300">
                            <option value="">Select Role...</option>
                            <option value="Lead Designer">Lead Designer</option>
                            <option value="Junior Designer">Junior Designer</option>
                            <option value="Copywriter">Copywriter</option>
                            <option value="Manager">Manager</option>
                        </select>
                        <button onClick={addTeamMember} className="bg-secondary text-white text-sm rounded font-bold hover:bg-primary">Add</button>
                    </div>
                     <input placeholder="Email (optional)" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} className="text-sm p-2 rounded border border-gray-300 w-full mt-2" />
                </div>
             </div>
          </div>
        )}

        {/* --- STEP 2: DELIVERABLES --- */}
        {step === 2 && (
             <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
                <h3 className="text-xl font-bold text-secondary mb-6 text-center">Deliverables & Content</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity of Assets</label>
                        <div className="flex items-center space-x-4">
                            <input 
                                type="range" min="1" max="50" value={fileQuantity} 
                                onChange={e => setFileQuantity(e.target.value)} 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                            <span className="font-bold text-primary text-xl w-12 text-center">{fileQuantity}</span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Required File Types</label>
                        <div className="flex flex-wrap gap-3">
                            {['PSD', 'AI', 'INDD', 'PDF', 'PNG', 'JPG', 'SVG'].map(type => (
                                <button 
                                    key={type}
                                    onClick={() => handleFileTypeChange(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${fileTypes.includes(type) ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-primary'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Content / Copy Information</label>
                        <textarea 
                            value={contentInfo} 
                            onChange={e => setContentInfo(e.target.value)} 
                            className="w-full p-4 bg-surface border border-gray-200 rounded-xl focus:outline-none focus:border-primary h-32"
                            placeholder="Paste the headlines, body text, or general themes here..."
                        ></textarea>
                    </div>
                </div>
             </div>
        )}

        {/* --- STEP 3: DESIGN DNA --- */}
        {step === 3 && (
            <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
                <h3 className="text-xl font-bold text-secondary mb-6 text-center">Design DNA</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color Palette</label>
                        <input value={palette} onChange={e => setPalette(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg" placeholder="e.g. Navy Blue, Gold, and White" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Typography</label>
                        <input value={typography} onChange={e => setTypography(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg" placeholder="e.g. Modern Sans-Serif for headers" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Graphic Elements</label>
                         <input value={graphicParams} onChange={e => setGraphicParams(e.target.value)} className="w-full p-3 bg-surface border border-gray-200 rounded-lg" placeholder="e.g. Geometric shapes, minimal icons" />
                    </div>
                </div>
            </div>
        )}

        {/* --- STEP 4: RESULT --- */}
        {step === 4 && (
            <div className="w-full h-full flex flex-col animate-fade-in-up">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold text-secondary">Generating Timeline...</h3>
                        <p className="text-gray-500">AI is assigning tasks to your team.</p>
                    </div>
                ) : generatedPlan ? (
                    <div className="flex-grow flex flex-col">
                        {/* Visualization Switcher */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-100 p-1 rounded-xl flex space-x-1">
                                <button 
                                    onClick={() => setVisualizationMode('timeline')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${visualizationMode === 'timeline' ? 'bg-white shadow-sm text-secondary' : 'text-gray-500 hover:text-secondary'}`}
                                >
                                    Timeline
                                </button>
                                <button 
                                    onClick={() => setVisualizationMode('kanban')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${visualizationMode === 'kanban' ? 'bg-white shadow-sm text-secondary' : 'text-gray-500 hover:text-secondary'}`}
                                >
                                    Kanban
                                </button>
                                <button 
                                    onClick={() => setVisualizationMode('calendar')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${visualizationMode === 'calendar' ? 'bg-white shadow-sm text-secondary' : 'text-gray-500 hover:text-secondary'}`}
                                >
                                    Calendar
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow overflow-y-auto pr-2">
                            {visualizationMode === 'timeline' && renderTimelineView()}
                            {visualizationMode === 'kanban' && renderKanbanView()}
                            {visualizationMode === 'calendar' && renderCalendarView()}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-red-500 font-bold">{error || "Something went wrong."}</div>
                )}
            </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-gray-100 flex justify-between bg-white">
        {step > 1 && step < 4 && (
             <button onClick={prevStep} className="text-gray-500 font-bold hover:text-secondary px-6 py-3">
                 Back
             </button>
        )}
        {step === 1 && (
            <button onClick={() => setView('list')} className="text-gray-500 font-bold hover:text-secondary px-6 py-3">
                Cancel
            </button>
        )}
        
        {step < 3 && (
            <button onClick={nextStep} className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary shadow-lg ml-auto">
                Next Step
            </button>
        )}
        {step === 3 && (
            <button onClick={handleGenerate} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 shadow-lg ml-auto flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Generate Schedule
            </button>
        )}
        {step === 4 && (
             <button onClick={() => setView('list')} className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary shadow-lg ml-auto">
                Save & Close
            </button>
        )}
      </div>
    </div>
  );
};

export default SmartCalendarTool;