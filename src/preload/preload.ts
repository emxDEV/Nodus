
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('nodus', {
    listNotes: (folder?: 'notes' | 'inbox') => ipcRenderer.invoke('fs:list-notes', folder),
    readNote: (filename: string, folder?: 'notes' | 'inbox') => ipcRenderer.invoke('fs:read-note', filename, folder),
    writeNote: (filename: string, content: string, folder?: 'notes' | 'inbox') => ipcRenderer.invoke('fs:write-note', filename, content, folder),
    scanGraph: () => ipcRenderer.invoke('fs:scan-graph'),
})
