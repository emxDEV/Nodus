import { ipcMain, dialog } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';

// We'll default to specific folder in Documents for now
const NOTES_DIR = path.join(app.getPath('documents'), 'NODUS_Brain/Notes');
const INBOX_DIR = path.join(app.getPath('documents'), 'NODUS_Brain/Inbox');

const ensureDirs = async () => {
    await fs.mkdir(NOTES_DIR, { recursive: true });
    await fs.mkdir(INBOX_DIR, { recursive: true });
};

export const setupFileSystemHandlers = () => {
    ensureDirs().catch(console.error);

    ipcMain.handle('fs:list-notes', async (_, folder: 'notes' | 'inbox' = 'notes') => {
        const targetDir = folder === 'inbox' ? INBOX_DIR : NOTES_DIR;
        try {
            const files = await fs.readdir(targetDir);
            return files.filter(f => f.endsWith('.md'));
        } catch (e) {
            console.error(e);
            return [];
        }
    });

    ipcMain.handle('fs:read-note', async (_, filename: string, folder: 'notes' | 'inbox' = 'notes') => {
        const targetDir = folder === 'inbox' ? INBOX_DIR : NOTES_DIR;
        try {
            const content = await fs.readFile(path.join(targetDir, filename), 'utf-8');
            return content;
        } catch (e) {
            console.error(e);
            return '';
        }
    });

    ipcMain.handle('fs:write-note', async (_, filename: string, content: string, folder: 'notes' | 'inbox' = 'notes') => {
        const targetDir = folder === 'inbox' ? INBOX_DIR : NOTES_DIR;
        try {
            await fs.writeFile(path.join(targetDir, filename), content, 'utf-8');
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    });

    ipcMain.handle('fs:scan-graph', async () => {
        try {
            const files = await fs.readdir(NOTES_DIR);
            const notes = files.filter(f => f.endsWith('.md'));

            // Adjacency List: { "TargetNote": ["SourceNote1", "SourceNote2"] }
            const backlinks: Record<string, string[]> = {};
            const forwardLinks: Record<string, string[]> = {};

            for (const file of notes) {
                const content = await fs.readFile(path.join(NOTES_DIR, file), 'utf-8');
                const title = file.replace('.md', '');

                // Extract [[Links]]
                const regex = /\[\[(.*?)\]\]/g;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    const target = match[1]; // The 'Target' in [[Target]]

                    // Track forward link
                    if (!forwardLinks[title]) forwardLinks[title] = [];
                    forwardLinks[title].push(target);

                    // Track backlink
                    if (!backlinks[target]) backlinks[target] = [];
                    if (!backlinks[target].includes(title)) {
                        backlinks[target].push(title);
                    }
                }
            }
            return { backlinks, forwardLinks };
        } catch (e) {
            console.error(e);
            return { backlinks: {}, forwardLinks: {} };
        }
    });
};
