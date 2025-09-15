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

// Initialize the application
document.addEventListener('DOMContentLoaded', (): void => {
    initializeDrawflow();
    setupEventListeners();
    setupDragAndDrop();
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

    editor.on('mouseMove', (position: { x: number; y: number }): void => {
        console.log('Position mouse x:' + position.x + ' y:'+ position.y);
    });

    editor.on('nodeMoved', (id: string): void => {
        console.log("Node moved " + id);
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
        if (ev.dataTransfer && nodeType) {
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
