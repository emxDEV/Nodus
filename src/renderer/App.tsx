import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { InboxModule } from './components/InboxModule';

// Icons
const IconCommand = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
const IconInbox = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
const IconNote = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
const IconProject = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
const IconTask = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>

// Layout Components
interface SidebarItemProps {
    icon: React.ComponentType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 
    ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
        <Icon />
        <span className="text-sm font-medium">{label}</span>
    </div>
);



function App() {
    const [activeModule, setActiveModule] = useState('command-center');
    const [activeNote, setActiveNote] = useState<string | null>(null);
    const [notes, setNotes] = useState<string[]>([]);

    // Refresh notes list when module changes
    React.useEffect(() => {
        if (activeModule === 'notes') {
            window.nodus.listNotes().then(setNotes);
        }
    }, [activeModule]);

    const createNote = async () => {
        const filename = `Untitled ${Date.now()}.md`;
        await window.nodus.writeNote(filename, '# New Note\n');
        setActiveNote(filename);
        const list = await window.nodus.listNotes();
        setNotes(list);
    };

    const [backlinks, setBacklinks] = useState<string[]>([]);

    // Load backlinks when note changes
    React.useEffect(() => {
        if (activeNote) {
            window.nodus.scanGraph().then(graph => {
                const title = activeNote.replace('.md', '');
                setBacklinks(graph.backlinks[title] || []);
            });
        } else {
            setBacklinks([]);
        }
    }, [activeNote]);

    // ... (createNote function)

    return (
        <div className="flex h-screen bg-[#121212] text-gray-200">
            {/* Sidebar */}
            <div className="w-64 bg-[#1E1E1E] flex flex-col border-r border-white/5 pt-10 px-3">
                <div className="mb-8 px-3">
                    <h1 className="text-xl font-bold tracking-tight text-white/90">NODUS</h1>
                </div>

                <div className="space-y-1">
                    <SidebarItem icon={IconCommand} label="Command Center" active={activeModule === 'command-center'} onClick={() => setActiveModule('command-center')} />
                    <SidebarItem icon={IconInbox} label="Inbox" active={activeModule === 'inbox'} onClick={() => setActiveModule('inbox')} />
                </div>

                <div className="mt-8 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Second Brain
                </div>
                <div className="space-y-1">
                    <SidebarItem icon={IconNote} label="Notes" active={activeModule === 'notes'} onClick={() => setActiveModule('notes')} />
                    <SidebarItem icon={IconProject} label="Projects" active={activeModule === 'projects'} onClick={() => setActiveModule('projects')} />
                    <SidebarItem icon={IconTask} label="Tasks" active={activeModule === 'tasks'} onClick={() => setActiveModule('tasks')} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="h-10 draggable"></div>
                <div className="flex-1 h-full overflow-hidden">
                    {activeModule === 'command-center' && (
                        <div className="p-8 overflow-y-auto h-full">
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold text-white mb-2">Good Morning, Operator.</h2>
                                <div className="text-gray-400 mb-8">System Status: Online</div>

                                <div className="mb-8">
                                    <div className="text-xs font-bold text-gray-500 mb-4 tracking-widest uppercase">Today Focus</div>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center p-4 bg-[#1E1E1E] rounded-lg border border-white/5">
                                                <div className="w-5 h-5 rounded-full border border-gray-600 mr-4"></div>
                                                <div className="text-gray-400 italic">Empty Slot</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModule === 'inbox' && <InboxModule />}
                    {activeModule === 'notes' && (
                        <div className="flex h-full">
                            {/* Note List (Subsidebar) */}
                            <div className="w-64 border-r border-white/5 bg-[#181818] flex flex-col">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="font-semibold text-sm text-gray-400">All Notes</span>
                                    <button onClick={createNote} className="text-gray-400 hover:text-white">+</button>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2">
                                    {notes.map(note => (
                                        <div
                                            key={note}
                                            onClick={() => setActiveNote(note)}
                                            className={`p-2 rounded text-sm cursor-pointer mb-1 ${activeNote === note ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                        >
                                            {note.replace('.md', '')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Editor & Inspector */}
                            <div className="flex-1 bg-[#121212] flex">
                                <div className="flex-1 p-16 max-w-4xl mx-auto h-full">
                                    <div className="h-full">
                                        <Editor filename={activeNote} />
                                    </div>
                                </div>

                                {/* Right Sidebar: Backlinks Inspector */}
                                {activeNote && (
                                    <div className="w-64 border-l border-white/5 p-4 bg-[#181818]">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Linked Mentions</h3>
                                        {backlinks.length === 0 ? (
                                            <div className="text-gray-600 text-sm italic">No backlinks found.</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {backlinks.map(source => (
                                                    <div
                                                        key={source}
                                                        className="text-sm text-sage hover:underline cursor-pointer"
                                                        onClick={() => setActiveNote(`${source}.md`)}
                                                    >
                                                        [[{source}]]
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default App;
