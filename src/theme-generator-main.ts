// Main TypeScript file for Drawflow Theme Generator
// This file contains all the core functionality extracted from theme-generator.html

/// <reference path="./types/drawflow.d.ts" />

// Type imports (commented out to avoid module issues)
// import type { 
//   TouchEvent, 
//   DragEvent, 
//   DropEvent, 
//   MouseEvent,
//   SampleDataResponse 
// } from './types/index';

// Global variables with proper typing
let editor: any;
let transform: string = '';
let mobile_item_selec: string = '';
let mobile_last_move: any = null;
let isResizing: boolean = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', (): void => {
    initializeDrawflow();
    setupEventListeners();
    setupDragAndDrop();
    setupResizeHandlers();
    loadSampleData();
});

// Initialize Drawflow editor
function initializeDrawflow(): void {
    const id = document.getElementById("drawflow");
    if (!id) {
        throw new Error("Drawflow container element not found");
    }
    editor = new (window as any).Drawflow(id);
    editor.reroute = true;
    editor.start();
}

// Load sample data from JSON file
async function loadSampleData(): Promise<void> {
    try {
        const response: Response = await fetch('sample-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const dataToImport: any = await response.json();
        editor.import(dataToImport);
    } catch (error) {
        console.error('Error loading sample data:', error);
        // Fallback: add some basic nodes if JSON loading fails
        addFallbackNodes();
    }
}

// Add fallback nodes if sample data fails to load
function addFallbackNodes(): void {
    // Add basic nodes if sample data fails to load
    const welcomeHtml: string = `
        <div>
          <div class="title-box">👏 Welcome!!</div>
          <div class="box">
            <p>Simple flow library <b>demo</b>
            <a href="https://github.com/jerosoler/Drawflow" target="_blank">Drawflow</a> by <b>Jero Soler</b></p><br>
            <p>Multiple input / outputs<br>
               Data sync nodes<br>
               Import / export<br>
               Modules support<br>
               Simple use<br>
               Type: Fixed or Edit<br>
               Events: view console<br>
               Pure Javascript<br>
            </p>
          </div>
        </div>
    `;
    
    editor.addNode('welcome', {}, {}, 50, 50, 'welcome', {}, welcomeHtml, false);
}

// Set up event listeners for Drawflow
function setupEventListeners(): void {
    // Node events
    editor.on('nodeCreated', (id: string): void => {
        console.log("Node created " + id);
    });

    editor.on('nodeRemoved', (id: string): void => {
        console.log("Node removed " + id);
    });

    editor.on('nodeSelected', (id: string): void => {
        console.log("Node selected " + id);
    });

    editor.on('moduleCreated', (name: string): void => {
        console.log("Module Created " + name);
    });

    editor.on('moduleChanged', (name: string): void => {
        console.log("Module Changed " + name);
    });

    editor.on('connectionCreated', (connection: any): void => {
        console.log('Connection created');
        console.log(connection);
    });

    editor.on('connectionRemoved', (connection: any): void => {
        console.log('Connection removed');
        console.log(connection);
    });

    editor.on('mouseMove', (_position: { x: number; y: number }): void => {
        //console.log('Position mouse x:' + _position.x + ' y:'+ _position.y);
    });

    editor.on('nodeMoved', (id: string): void => {
        // Only log if not resizing to avoid spam during resize
        if (!isResizing) {
            console.log("Node moved " + id);
        }
    });

    editor.on('zoom', (zoom: number): void => {
        console.log('Zoom level ' + zoom);
    });

    editor.on('translate', (position: { x: number; y: number }): void => {
        console.log('Translate x:' + position.x + ' y:'+ position.y);
    });

    editor.on('addReroute', (id: string): void => {
        console.log("Reroute added " + id);
    });

    editor.on('removeReroute', (id: string): void => {
        console.log("Reroute removed " + id);
    });
}

// Set up drag and drop functionality
function setupDragAndDrop(): void {
    const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('drag-drawflow');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        element.addEventListener('touchend', drop, false);
        element.addEventListener('touchmove', positionMobile, false);
        element.addEventListener('touchstart', drag, false);
    }
}

// Mobile touch position tracking
function positionMobile(ev: any): void {
    mobile_last_move = ev;
}

// Allow drop event
function allowDrop(ev: any): void {
    ev.preventDefault();
}

// Drag event handler
function drag(ev: any): void {
    if (ev.type === "touchstart") {
        const target = ev.target as HTMLElement;
        const dragElement = target.closest(".drag-drawflow") as HTMLElement;
        if (dragElement) {
            mobile_item_selec = dragElement.getAttribute('data-node') || '';
        }
    } else {
        const target = ev.target as HTMLElement;
        const nodeType = target.getAttribute('data-node');
        if (ev.dataTransfer && nodeType && !isResizing) {
            ev.dataTransfer.setData("node", nodeType);
        }
    }
}

// Drop event handler
function drop(ev: any): void {
    if (ev.type === "touchend") {
        if (mobile_last_move && mobile_last_move.touches && mobile_last_move.touches.length > 0) {
            const touch = mobile_last_move.touches[0];
            if (touch) {
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const parentdrawflow = element?.closest("#drawflow");
                if (parentdrawflow != null) {
                    addNodeToDrawFlow(mobile_item_selec, touch.clientX, touch.clientY);
                }
            }
        }
        mobile_item_selec = '';
    } else {
        ev.preventDefault();
        const data = ev.dataTransfer?.getData("node") || '';
        addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
}

// Add node to Drawflow canvas
function addNodeToDrawFlow(name: string, pos_x: number, pos_y: number): void {
    if (editor.editor_mode === 'fixed') {
        return;
    }
    
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - 
            (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - 
            (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    switch (name) {
        case 'facebook':
            const facebook: string = `
            <div>
              <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
            </div>
            `;
            editor.addNode('facebook', 0, 1, pos_x, pos_y, 'facebook', {}, facebook);
            break;
            
        case 'slack':
            const slackchat: string = `
            <div>
              <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
            </div>
            `;
            editor.addNode('slack', 1, 0, pos_x, pos_y, 'slack', {}, slackchat);
            break;
            
        case 'github':
            const githubtemplate: string = `
            <div>
              <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
              <div class="box">
                <p>Enter repository url</p>
              <input type="text" df-name>
              </div>
            </div>
            `;
            editor.addNode('github', 0, 1, pos_x, pos_y, 'github', { "name": ''}, githubtemplate);
            break;
            
        case 'telegram':
            const telegrambot: string = `
            <div>
              <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
              <div class="box">
                <p>Send to telegram</p>
                <p>select channel</p>
                <select df-channel>
                  <option value="channel_1">Channel 1</option>
                  <option value="channel_2">Channel 2</option>
                  <option value="channel_3">Channel 3</option>
                  <option value="channel_4">Channel 4</option>
                </select>
              </div>
            </div>
            `;
            editor.addNode('telegram', 1, 0, pos_x, pos_y, 'telegram', { "channel": 'channel_3'}, telegrambot);
            break;
            
        case 'aws':
            const aws: string = `
            <div>
              <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
              <div class="box">
                <p>Save in aws</p>
                <input type="text" df-db-dbname placeholder="DB name"><br><br>
                <input type="text" df-db-key placeholder="DB key">
                <p>Output Log</p>
              </div>
            </div>
            `;
            editor.addNode('aws', 1, 1, pos_x, pos_y, 'aws', { "db": { "dbname": '', "key": '' }}, aws);
            break;
            
        case 'log':
            const log: string = `
            <div>
              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
            </div>
            `;
            editor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
            break;
            
        case 'google':
            const google: string = `
            <div>
              <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
            </div>
            `;
            editor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google);
            break;
            
        case 'email':
            const email: string = `
            <div>
              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
            </div>
            `;
            editor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email);
            break;

        case 'template':
            const template: string = `
            <div>
              <div class="title-box"><i class="fas fa-code"></i> Template</div>
              <div class="box">
                Ger Vars
                <textarea df-template></textarea>
                Output template with vars
              </div>
            </div>
            `;
            editor.addNode('template', 1, 1, pos_x, pos_y, 'template', { "template": 'Write your template'}, template);
            break;
            
        case 'multiple':
            const multiple: string = `
            <div>
              <div class="box">
                Multiple!
              </div>
            </div>
            `;
            editor.addNode('multiple', 3, 4, pos_x, pos_y, 'multiple', {}, multiple);
            break;
            
        case 'personalized':
            const personalized: string = `
            <div>
              Personalized
            </div>
            `;
            editor.addNode('personalized', 1, 1, pos_x, pos_y, 'personalized', {}, personalized);
            break;
            
        case 'dbclick':
            const dbclick: string = `
            <div>
            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
              <div class="box dbclickbox" ondblclick="showpopup(event)">
                Db Click here
                <div class="modal" style="display:none">
                  <div class="modal-content">
                    <span class="close" onclick="closemodal(event)">&times;</span>
                    Change your variable {name} !
                    <input type="text" df-name>
                  </div>
                </div>
              </div>
            </div>
            `;
            editor.addNode('dbclick', 1, 1, pos_x, pos_y, 'dbclick', { name: ''}, dbclick);
            break;
            
        case 'endpoint':
            const endpoint: string = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div class="title-box"><i class="fas fa-plug"></i> API Endpoint</div>
              <div class="box" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <p style="margin: 0; font-weight: bold;">Endpoint Configuration</p>
                <input type="text" df-url placeholder="API URL" value="https://api.example.com" style="width: 100%;">
                <select df-method style="width: 100%;">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <p style="margin: 0; font-weight: bold;">Authentication</p>
                <input type="text" df-auth placeholder="Bearer token or API key" style="width: 100%;">
              </div>
            </div>
            `;
            editor.addNode('endpoint', 1, 1, pos_x, pos_y, 'endpoint', { 
                "url": 'https://api.example.com', 
                "method": 'GET', 
                "auth": '' 
            }, endpoint);
            break;
            
        case 'service':
            const service: string = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div class="title-box"><i class="fas fa-cogs"></i> Microservice</div>
              <div class="box" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <p style="margin: 0; font-weight: bold;">Service Configuration</p>
                <input type="text" df-service-name placeholder="Service Name" value="user-service" style="width: 100%;">
                <input type="text" df-port placeholder="Port" value="3000" style="width: 100%;">
                <select df-protocol style="width: 100%;">
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                  <option value="grpc">gRPC</option>
                </select>
                <p style="margin: 0; font-weight: bold;">Health Check</p>
                <input type="text" df-health-path placeholder="/health" value="/health" style="width: 100%;">
              </div>
            </div>
            `;
            editor.addNode('service', 2, 2, pos_x, pos_y, 'service', { 
                "serviceName": 'user-service', 
                "port": '3000', 
                "protocol": 'http',
                "healthPath": '/health'
            }, service);
            break;
            
        case 'application':
            const application: string = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div class="title-box"><i class="fas fa-desktop"></i> Application</div>
              <div class="box" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <p style="margin: 0; font-weight: bold;">Application Configuration</p>
                <input type="text" df-app-name placeholder="App Name" value="my-app" style="width: 100%;">
                <select df-framework style="width: 100%;">
                  <option value="react">React</option>
                  <option value="vue">Vue.js</option>
                  <option value="angular">Angular</option>
                  <option value="node">Node.js</option>
                  <option value="python">Python</option>
                </select>
                <p style="margin: 0; font-weight: bold;">Environment</p>
                <select df-environment style="width: 100%;">
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
                <p style="margin: 0; font-weight: bold;">Database</p>
                <input type="text" df-database placeholder="Database URL" style="width: 100%;">
              </div>
            </div>
            `;
            editor.addNode('application', 1, 3, pos_x, pos_y, 'application', { 
                "appName": 'my-app', 
                "framework": 'react', 
                "environment": 'development',
                "database": ''
            }, application);
            break;
            
        case 'data-mapping':
            const dataMapping: string = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div class="title-box"><i class="fas fa-exchange-alt"></i> Data Mapping</div>
              <div class="box" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <p style="margin: 0; font-weight: bold;">Mapping Configuration</p>
                
                <p style="margin: 0; font-weight: bold;">Mapping Rules</p>
                <textarea df-mapping-rules placeholder="Mapping Rules (JSONPath expressions)" style="width: 100%; height: 40px; resize: vertical;">$.id -> $.userId
$.name -> $.fullName</textarea>
              </div>
            </div>
            `;
            editor.addNode('data-mapping', 3, 3, pos_x, pos_y, 'data-mapping', { 
                "mappingName": 'user-data-mapping', 
                "transformationType": 'transform',
                "inputSchema": '{"type": "object", "properties": {"id": {"type": "string"}, "name": {"type": "string"}}}',
                "outputSchema": '{"type": "object", "properties": {"userId": {"type": "string"}, "fullName": {"type": "string"}}}',
                "mappingRules": '$.id -> $.userId\n$.name -> $.fullName'
            }, dataMapping);
            break;

        default:
            // No action for unknown node types
            console.warn(`Unknown node type: ${name}`);
    }
}

// Show popup modal for double-click functionality
function showpopup(e: any): void {
    const target = e.target as HTMLElement;
    const node = target.closest(".drawflow-node") as HTMLElement;
    const modal = target.children[0] as HTMLElement;
    
    if (node && modal) {
        node.style.zIndex = "9999";
        modal.style.display = "block";
    }

    transform = editor.precanvas.style.transform;
    editor.precanvas.style.transform = '';
    editor.precanvas.style.left = editor.canvas_x + 'px';
    editor.precanvas.style.top = editor.canvas_y + 'px';
    console.log(transform);

    editor.editor_mode = "fixed";
}

// Close popup modal
function closemodal(e: any): void {
    const target = e.target as HTMLElement;
    const node = target.closest(".drawflow-node") as HTMLElement;
    const modal = target.parentElement?.parentElement as HTMLElement;
    
    if (node && modal) {
        node.style.zIndex = "2";
        modal.style.display = "none";
    }
    
    editor.precanvas.style.transform = transform;
    editor.precanvas.style.left = '0px';
    editor.precanvas.style.top = '0px';
    editor.editor_mode = "edit";
}

// Change module selection
function changeModule(event: any): void {
    const target = event.target as HTMLElement;
    const all = document.querySelectorAll(".menu ul li");
    for (let i = 0; i < all.length; i++) {
        const element = all[i] as HTMLElement;
        element.classList.remove('selected');
    }
    target.classList.add('selected');
}

// Change editor mode (lock/unlock)
function changeMode(option: 'lock' | 'unlock'): void {
    const lock = document.getElementById('lock') as HTMLElement;
    const unlock = document.getElementById('unlock') as HTMLElement;
    
    if (!lock || !unlock) {
        console.warn('Lock/unlock elements not found');
        return;
    }
    
    if (option === 'lock') {
        lock.style.display = 'none';
        unlock.style.display = 'block';
    } else {
        lock.style.display = 'block';
        unlock.style.display = 'none';
    }
}

// Setup resize handlers for nodes
function setupResizeHandlers(): void {
    // Listen for node creation to add resize handlers
    editor.on('nodeCreated', (nodeId: string) => {
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
        if (nodeElement) {
            addResizeHandler(nodeElement, nodeId);
        }
    });

    // Add resize handlers to existing nodes
    setTimeout(() => {
        const existingNodes = document.querySelectorAll('.drawflow-node');
        existingNodes.forEach((nodeElement) => {
            const nodeId = (nodeElement as HTMLElement).getAttribute('data-id');
            if (nodeId) {
                addResizeHandler(nodeElement as HTMLElement, nodeId);
            }
        });
    }, 100);
}

// Add resize handler to a specific node
function addResizeHandler(nodeElement: HTMLElement, nodeId: string): void {
    // Add resize event listener
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            
            // Update the node data in Drawflow
            const nodeData = editor.getNodeFromId(nodeId);
            if (nodeData) {
                nodeData.width = width;
                nodeData.height = height;
                
                // Update the node in the editor
                editor.updateNodeDataFromId(nodeId, nodeData);
            }
        }
    });

    resizeObserver.observe(nodeElement);

    // Add mouse event listeners to detect resize start/end
    nodeElement.addEventListener('mousedown', (e: MouseEvent) => {
        // Check if the mouse is near the resize handle (bottom-right corner)
        const rect = nodeElement.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // If mouse is within 20px of bottom-right corner, it's likely a resize
        if (mouseX > rect.right - 20 && mouseY > rect.bottom - 20) {
            isResizing = true;
            // Temporarily disable editor dragging
            if (editor && editor.editor_mode === 'edit') {
                editor.editor_mode = 'fixed';
                // Store original mode to restore later
                (nodeElement as any).originalMode = 'edit';
            }
        }
    });

    nodeElement.addEventListener('mouseup', () => {
        if (isResizing) {
            // Small delay to ensure resize is complete
            setTimeout(() => {
                isResizing = false;
                // Restore original editor mode
                if (editor && (nodeElement as any).originalMode) {
                    editor.editor_mode = (nodeElement as any).originalMode;
                    (nodeElement as any).originalMode = null;
                }
            }, 100);
        }
    });

    // Also listen for resize events on the window to catch resize end
    const handleResizeEnd = () => {
        if (isResizing) {
            isResizing = false;
        }
    };

    window.addEventListener('mouseup', handleResizeEnd);
    window.addEventListener('blur', handleResizeEnd);

    // Store the observer and cleanup function for cleanup if needed
    (nodeElement as any).resizeObserver = resizeObserver;
    (nodeElement as any).resizeCleanup = () => {
        window.removeEventListener('mouseup', handleResizeEnd);
        window.removeEventListener('blur', handleResizeEnd);
    };
}

// Import data from JSON file
function importDataFromFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
        return;
    }
    
    // Check file type
    if (!file.name.toLowerCase().endsWith('.json')) {
        alert('Please select a valid JSON file.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);
            
            // Validate the data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid JSON structure');
            }
            
            // Check if it's a Drawflow export
            if (!data.drawflow) {
                throw new Error('This doesn\'t appear to be a valid Drawflow export file');
            }
            
            // Clear current canvas
            editor.clearModuleSelected();
            
            // Import the data
            editor.import(data);
            
            // Reset the file input
            input.value = '';
            
        } catch (error) {
            console.error('Import error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Import failed: ${errorMessage}`);
            
            // Reset the file input
            input.value = '';
        }
    };
    
    reader.onerror = () => {
        alert('Error reading the file');
        // Reset the file input
        input.value = '';
    };
    
    reader.readAsText(file);
}

// Download export as JSON file
function downloadExport(): void {
    try {
        // Get the current Drawflow data
        const data = editor.export();
        
        // Create a filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `drawflow-export-${timestamp}.json`;
        
        // Convert data to JSON string with pretty formatting
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create a blob with the JSON data
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Export error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Export failed: ${errorMessage}`);
    }
}

// Export functions to global scope for HTML compatibility
(window as any).showpopup = showpopup;
(window as any).closemodal = closemodal;
(window as any).changeModule = changeModule;
(window as any).changeMode = changeMode;
(window as any).drag = drag;
(window as any).drop = drop;
(window as any).allowDrop = allowDrop;
(window as any).positionMobile = positionMobile;
(window as any).addNodeToDrawFlow = addNodeToDrawFlow;
(window as any).importDataFromFile = importDataFromFile;
(window as any).downloadExport = downloadExport;
