import React, { useState, useEffect } from 'react';

interface EditorProps {
    filename: string | null;
}

export const Editor: React.FC<EditorProps> = ({ filename }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (filename) {
            window.nodus.readNote(filename).then(setContent);
        } else {
            setContent('');
        }
    }, [filename]);

    // Agent 3: Simple Regex Highlighting Overlay
    // In a real app we'd use a contenteditable div or CodeMirror, 
    // but for MVP we overlay a highlighted div behind the transparent textarea.

    // Parse for [[Link]]
    const renderHighlights = (text: string) => {
        // We split by tokens to wrap links
        const parts = text.split(/(\[\[.*?\]\])/g);
        return parts.map((part, i) => {
            if (part.startsWith('[[') && part.endsWith(']]')) {
                return <span key={i} className="text-sage font-bold bg-white/5 rounded px-0.5">{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        // Auto-save debouncing would go here (Agent 4 domain), 
        // for now direct save on every couple chars or blur is okay for MVP test
        if (filename) {
            // Default to 'notes' folder for general editor
            window.nodus.writeNote(filename, newContent, 'notes');
        }
    };

    if (!filename) {
        return <div className="flex h-full items-center justify-center text-gray-500 italic">Select a note to edit</div>;
    }

    return (
        <div className="h-full flex flex-col relative text-base font-mono leading-relaxed">
            <input
                className="bg-transparent text-3xl font-bold text-white mb-6 outline-none placeholder-gray-600 z-10 relative"
                value={filename.replace('.md', '')}
                readOnly
                disabled
            />

            <div className="flex-1 relative">
                {/* Backdrop for highlighting */}
                <div className="absolute inset-0 pointer-events-none text-transparent whitespace-pre-wrap break-words p-0 border border-transparent">
                    {renderHighlights(content)}
                </div>

                {/* Actual Editor */}
                <textarea
                    className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none text-gray-300 whitespace-pre-wrap break-words p-0 caret-white"
                    value={content}
                    onChange={handleChange}
                    spellCheck={false}
                    placeholder="Start thinking..."
                    style={{ color: 'transparent', caretColor: '#ECECEC' }} // Make text transparent so backdrop shows through, but caret visible
                />
            </div>
        </div>
    );
};
