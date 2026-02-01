import React, { useState, useEffect } from 'react';

// Agent 2: Inbox UI
export const InboxModule = () => {
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        loadInbox();
    }, []);

    const loadInbox = () => window.nodus.listNotes('inbox').then(setItems);

    const handleCapture = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newItem.trim()) {
            // Agent 4: Capture Logic -> Create "Timestamp.md" in Inbox
            const filename = `Capture ${Date.now()}.md`;
            await window.nodus.writeNote(filename, newItem, 'inbox');
            setNewItem('');
            loadInbox();
        }
    };

    return (
        <div className="max-w-3xl mx-auto pt-10">
            <h2 className="text-3xl font-bold text-white mb-6">Inbox</h2>

            {/* Fast Capture Input */}
            <div className="mb-8">
                <input
                    type="text"
                    className="w-full bg-[#1E1E1E] border border-white/10 rounded-lg p-4 text-lg text-white placeholder-gray-500 focus:border-sage focus:outline-none transition-colors"
                    placeholder="Capture idea..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleCapture}
                    autoFocus
                />
                <div className="text-xs text-gray-500 mt-2 text-right">Press Enter to capture</div>
            </div>

            {/* List */}
            <div className="space-y-2">
                {items.length === 0 && <div className="text-center text-gray-500 py-10">Inbox Zero. Mind Empty.</div>}

                {items.map(item => (
                    <div key={item} className="bg-[#1E1E1E] border border-white/5 rounded p-4 flex items-center justify-between group hover:border-white/20 transition-all">
                        <span className="text-gray-300">Note: {item}</span>
                        <span className="text-xs text-gray-600 uppercase tracking-widest">Unprocessed</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
