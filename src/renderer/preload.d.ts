
declare global {
    interface Window {
        nodus: {
            listNotes: (folder?: 'notes' | 'inbox') => Promise<string[]>;
            readNote: (filename: string, folder?: 'notes' | 'inbox') => Promise<string>;
            writeNote: (filename: string, content: string, folder?: 'notes' | 'inbox') => Promise<boolean>;
            scanGraph: () => Promise<{ backlinks: Record<string, string[]>, forwardLinks: Record<string, string[]> }>;
        }
    }
}

export { };
