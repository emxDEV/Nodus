export type NodusModule = 'command-center' | 'inbox' | 'notes' | 'projects' | 'tasks';

export interface Note {
    id: string;      // UUID or filename
    title: string;
    content: string; // Markdown
    tags: string[];
    backlinks: string[]; // IDs of notes linking here
    modifiedAt: Date;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    projectId?: string;
    dueDate?: Date;
}

export interface Project {
    id: string;
    name: string;
    status: 'active' | 'on-hold' | 'completed';
    goal: string;
}
