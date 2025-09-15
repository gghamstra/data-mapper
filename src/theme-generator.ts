// Drawflow Theme Generator TypeScript Implementation
/// <reference path="./types/drawflow.d.ts" />

// Type imports (commented out to avoid module issues)
// import type { ThemeConfig, NodeOptions, SampleDataResponse } from './types/index';

// Drawflow Theme Generator Class
class ThemeGenerator {
    private editor!: any;
    private nodeCounter: number = 0;
    public selectedNode: string | null = null;
    private theme: any;

    constructor() {
        this.theme = {
            background: {
                color: '#ffffff',
                size: 20,
                lineColor: '#000000'
            },
            node: {
                backgroundColor: '#ffffff',
                textColor: '#000000',
                borderSize: 2,
                borderColor: '#cccccc',
                borderRadius: 8,
                minHeight: 80,
                minWidth: 150,
                paddingTop: 10,
                paddingBottom: 10,
                shadow: {
                    horizontal: 2,
                    vertical: 2,
                    blur: 4,
                    spread: 0,
                    color: '#000000'
                },
                hover: {
                    backgroundColor: '#f8f9fa',
                    textColor: '#000000'
                },
                selected: {
                    backgroundColor: '#e3f2fd',
                    borderColor: '#2196f3'
                }
            },
            connection: {
                width: 3,
                color: '#000000',
                hover: {
                    color: '#666666'
                },
                selected: {
                    color: '#2196f3'
                }
            }
        };
        
        // init() will be called manually after DOM is ready
    }

    async init(): Promise<void> {
        // Initialize Drawflow
        const container = document.getElementById('drawflow');
        if (!container) {
            throw new Error('Drawflow container element not found');
        }
        this.editor = new (window as any).Drawflow(container);
        this.editor.start();

        // Set up event listeners
        this.setupEventListeners();
        
        // Add initial sample nodes
        await this.addInitialNodes();
        
        // Apply initial theme
        this.updateTheme();
        
        // Set up input synchronization
        this.setupInputSync();
    }

    private setupEventListeners(): void {
        // Node events
        this.editor.on('nodeCreated', (id: string): void => {
            console.log('Node created:', id);
        });

        this.editor.on('nodeSelected', (id: string): void => {
            this.selectedNode = id;
            this.showNodeInfo(id);
        });

        this.editor.on('nodeUnselected', (): void => {
            this.selectedNode = null;
            this.hideNodeInfo();
        });

        this.editor.on('nodeRemoved', (id: string): void => {
            console.log('Node removed:', id);
            if (this.selectedNode === id) {
                this.hideNodeInfo();
            }
        });

        // Connection events
        this.editor.on('connectionCreated', (connection: any): void => {
            console.log('Connection created:', connection);
        });

        this.editor.on('connectionRemoved', (connection: any): void => {
            console.log('Connection removed:', connection);
        });

        // Mouse events
        this.editor.on('click', (_event: MouseEvent): void => {
            // Handle canvas clicks
        });
    }

    private setupInputSync(): void {
        // Sync color inputs with text inputs
        const colorInputs = document.querySelectorAll('input[type="color"]') as NodeListOf<HTMLInputElement>;
        colorInputs.forEach(input => {
            const textInput = document.getElementById(input.id + 'Text') as HTMLInputElement;
            if (textInput) {
                input.addEventListener('change', (): void => {
                    textInput.value = input.value;
                });
            }
        });

        // Sync range inputs with number inputs
        const rangeInputs = document.querySelectorAll('input[type="range"]') as NodeListOf<HTMLInputElement>;
        rangeInputs.forEach(input => {
            const numberInput = document.getElementById(input.id + 'Value') as HTMLInputElement;
            if (numberInput) {
                input.addEventListener('input', (): void => {
                    numberInput.value = input.value;
                });
                numberInput.addEventListener('change', (): void => {
                    input.value = numberInput.value;
                });
            }
        });
    }

    private async addInitialNodes(): Promise<void> {
        // Try to load sample data from JSON file first
        try {
            const response: Response = await fetch('sample-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sampleData: any = await response.json();
            this.editor.import(sampleData);
        } catch (error) {
            console.log('Sample data not found, creating basic nodes');
            // Fallback: Add sample nodes to demonstrate the theme
            this.addSampleNode('input', { x: 200, y: 150 });
            this.addSampleNode('transform', { x: 500, y: 150 });
            this.addSampleNode('output', { x: 800, y: 150 });

            // Add connections
            setTimeout(() => {
                this.editor.addConnection('node-1', 'node-2', 'output_1', 'input_1');
                this.editor.addConnection('node-2', 'node-3', 'output_1', 'input_1');
            }, 100);
        }
    }

    public addSampleNode(type: string, options: any = {}): void {
        this.nodeCounter++;
        const nodeId = `node-${this.nodeCounter}`;
        const x = options.x || Math.random() * 800 + 100;
        const y = options.y || Math.random() * 400 + 100;
        const data = options.data || {};

        let html: string;
        let inputs: Record<string, any>;
        let outputs: Record<string, any>;
        let className: string;

        switch (type) {
            case 'input':
                className = 'input-node';
                html = `
                    <div class="node-content input-node">
                        <div class="node-header">
                            <i class="icon">📥</i>
                            <span class="node-title">Data Input</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Source:</label>
                                <span>${data['source'] || 'Database'}</span>
                            </div>
                            <div class="node-field">
                                <label>Table:</label>
                                <span>${data['table'] || 'users'}</span>
                            </div>
                        </div>
                    </div>
                `;
                inputs = {};
                outputs = { output_1: { connections: [] } };
                break;

            case 'transform':
                className = 'transform-node';
                html = `
                    <div class="node-content transform-node">
                        <div class="node-header">
                            <i class="icon">🔄</i>
                            <span class="node-title">Transform</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Operation:</label>
                                <span>${data['operation'] || 'Join'}</span>
                            </div>
                            <div class="node-field">
                                <label>Table:</label>
                                <span>${data['table'] || 'orders'}</span>
                            </div>
                        </div>
                    </div>
                `;
                inputs = { input_1: { connections: [] } };
                outputs = { output_1: { connections: [] } };
                break;

            case 'filter':
                className = 'filter-node';
                html = `
                    <div class="node-content filter-node">
                        <div class="node-header">
                            <i class="icon">🔍</i>
                            <span class="node-title">Filter</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Condition:</label>
                                <span>${data['condition'] || 'age > 18'}</span>
                            </div>
                        </div>
                    </div>
                `;
                inputs = { input_1: { connections: [] } };
                outputs = { output_1: { connections: [] } };
                break;

            case 'output':
                className = 'output-node';
                html = `
                    <div class="node-content output-node">
                        <div class="node-header">
                            <i class="icon">📤</i>
                            <span class="node-title">Data Output</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Destination:</label>
                                <span>${data['destination'] || 'API'}</span>
                            </div>
                            <div class="node-field">
                                <label>Endpoint:</label>
                                <span>${data['endpoint'] || '/users'}</span>
                            </div>
                        </div>
                    </div>
                `;
                inputs = { input_1: { connections: [] } };
                outputs = {};
                break;

            default:
                return;
        }

        this.editor.addNode(
            nodeId,
            inputs,
            outputs,
            x,
            y,
            className,
            data,
            html,
            false
        );
    }

    private showNodeInfo(nodeId: string): void {
        const node = this.editor.getNodeFromId(nodeId);
        if (node) {
            const nodeInfo = document.getElementById('nodeInfo');
            const nodeDetails = document.getElementById('nodeDetails');
            
            if (nodeInfo && nodeDetails) {
                nodeDetails.innerHTML = `
                    <p><strong>ID:</strong> ${nodeId}</p>
                    <p><strong>Type:</strong> ${node.class}</p>
                    <p><strong>Position:</strong> (${node.pos_x}, ${node.pos_y})</p>
                    <p><strong>Data:</strong></p>
                    <pre>${JSON.stringify(node.data, null, 2)}</pre>
                `;
                
                nodeInfo.style.display = 'block';
            }
        }
    }

    private hideNodeInfo(): void {
        const nodeInfo = document.getElementById('nodeInfo');
        if (nodeInfo) {
            nodeInfo.style.display = 'none';
        }
    }

    public deleteNode(nodeId: string): void {
        if (nodeId) {
            this.editor.removeNodeId(nodeId);
            this.selectedNode = null;
            this.hideNodeInfo();
        }
    }

    public clearCanvas(): void {
        if (confirm('Are you sure you want to clear the canvas?')) {
            this.editor.clear();
            this.nodeCounter = 0;
            this.selectedNode = null;
            this.hideNodeInfo();
        }
    }

    public exportData(): void {
        const data = this.editor.export();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawflow-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    public importData(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event: Event): void => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>): void => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        this.editor.import(data);
                        console.log('Data imported successfully');
                    } catch (error) {
                        alert('Error importing data: ' + (error as Error).message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    public updateTheme(): void {
        // Update theme object from form inputs
        this.theme.background.color = (document.getElementById('bgColor') as HTMLInputElement)?.value || '#ffffff';
        this.theme.background.size = parseInt((document.getElementById('bgSize') as HTMLInputElement)?.value || '20');
        this.theme.background.lineColor = (document.getElementById('lineColor') as HTMLInputElement)?.value || '#000000';

        this.theme.node.backgroundColor = (document.getElementById('nodeBgColor') as HTMLInputElement)?.value || '#ffffff';
        this.theme.node.textColor = (document.getElementById('nodeTextColor') as HTMLInputElement)?.value || '#000000';
        this.theme.node.borderSize = parseInt((document.getElementById('nodeBorderSize') as HTMLInputElement)?.value || '2');
        this.theme.node.borderColor = (document.getElementById('nodeBorderColor') as HTMLInputElement)?.value || '#cccccc';
        this.theme.node.borderRadius = parseInt((document.getElementById('nodeBorderRadius') as HTMLInputElement)?.value || '8');
        this.theme.node.minHeight = parseInt((document.getElementById('nodeMinHeight') as HTMLInputElement)?.value || '80');
        this.theme.node.minWidth = parseInt((document.getElementById('nodeMinWidth') as HTMLInputElement)?.value || '150');
        this.theme.node.paddingTop = parseInt((document.getElementById('nodePaddingTop') as HTMLInputElement)?.value || '10');
        this.theme.node.paddingBottom = parseInt((document.getElementById('nodePaddingBottom') as HTMLInputElement)?.value || '10');

        this.theme.node.shadow.horizontal = parseInt((document.getElementById('nodeShadowH') as HTMLInputElement)?.value || '2');
        this.theme.node.shadow.vertical = parseInt((document.getElementById('nodeShadowV') as HTMLInputElement)?.value || '2');
        this.theme.node.shadow.blur = parseInt((document.getElementById('nodeShadowBlur') as HTMLInputElement)?.value || '4');
        this.theme.node.shadow.spread = parseInt((document.getElementById('nodeShadowSpread') as HTMLInputElement)?.value || '0');
        this.theme.node.shadow.color = (document.getElementById('nodeShadowColor') as HTMLInputElement)?.value || '#000000';

        this.theme.node.hover.backgroundColor = (document.getElementById('nodeHoverBgColor') as HTMLInputElement)?.value || '#f8f9fa';
        this.theme.node.hover.textColor = (document.getElementById('nodeHoverTextColor') as HTMLInputElement)?.value || '#000000';

        this.theme.node.selected.backgroundColor = (document.getElementById('nodeSelectedBgColor') as HTMLInputElement)?.value || '#e3f2fd';
        this.theme.node.selected.borderColor = (document.getElementById('nodeSelectedBorderColor') as HTMLInputElement)?.value || '#2196f3';

        this.theme.connection.width = parseInt((document.getElementById('connectionWidth') as HTMLInputElement)?.value || '3');
        this.theme.connection.color = (document.getElementById('connectionColor') as HTMLInputElement)?.value || '#000000';
        this.theme.connection.hover.color = (document.getElementById('connectionHoverColor') as HTMLInputElement)?.value || '#666666';
        this.theme.connection.selected.color = (document.getElementById('connectionSelectedColor') as HTMLInputElement)?.value || '#2196f3';

        // Apply theme to the editor
        this.applyTheme();
        
        // Update CSS output
        this.updateCSSOutput();
    }

    public updateThemeFromText(): void {
        // Update color inputs from text inputs
        const textInputs = document.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
        textInputs.forEach(input => {
            if (input.id.endsWith('Text')) {
                const colorInput = document.getElementById(input.id.replace('Text', '')) as HTMLInputElement;
                if (colorInput && this.isValidColor(input.value)) {
                    colorInput.value = input.value;
                }
            }
        });
        this.updateTheme();
    }

    private isValidColor(color: string): boolean {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    private applyTheme(): void {
        const style = document.getElementById('dynamic-theme');
        if (style) {
            style.remove();
        }

        const newStyle = document.createElement('style');
        newStyle.id = 'dynamic-theme';
        newStyle.textContent = this.generateCSS();
        document.head.appendChild(newStyle);
    }

    private generateCSS(): string {
        const t = this.theme;
        return `
            /* Background */
            .drawflow {
                background-color: ${t.background.color} !important;
                background-image: 
                    linear-gradient(${t.background.lineColor} 1px, transparent 1px),
                    linear-gradient(90deg, ${t.background.lineColor} 1px, transparent 1px);
                background-size: ${t.background.size}px ${t.background.size}px;
            }

            /* Node Base Styles */
            .drawflow .drawflow-node {
                background-color: ${t.node.backgroundColor} !important;
                color: ${t.node.textColor} !important;
                border: ${t.node.borderSize}px solid ${t.node.borderColor} !important;
                border-radius: ${t.node.borderRadius}px !important;
                min-height: ${t.node.minHeight}px !important;
                min-width: ${t.node.minWidth}px !important;
                padding-top: ${t.node.paddingTop}px !important;
                padding-bottom: ${t.node.paddingBottom}px !important;
                box-shadow: ${t.node.shadow.horizontal}px ${t.node.shadow.vertical}px ${t.node.shadow.blur}px ${t.node.shadow.spread}px ${t.node.shadow.color} !important;
                transition: all 0.3s ease !important;
            }

            /* Node Hover */
            .drawflow .drawflow-node:hover {
                background-color: ${t.node.hover.backgroundColor} !important;
                color: ${t.node.hover.textColor} !important;
            }

            /* Node Selected */
            .drawflow .drawflow-node.selected {
                background-color: ${t.node.selected.backgroundColor} !important;
                border-color: ${t.node.selected.borderColor} !important;
                box-shadow: 0 0 0 3px ${t.node.selected.borderColor} !important;
            }

            /* Connection Styles */
            .drawflow .connection .main-path {
                stroke: ${t.connection.color} !important;
                stroke-width: ${t.connection.width}px !important;
            }

            .drawflow .connection:hover .main-path {
                stroke: ${t.connection.hover.color} !important;
            }

            .drawflow .connection.selected .main-path {
                stroke: ${t.connection.selected.color} !important;
            }

            /* Connection Points */
            .drawflow .connection .point {
                fill: ${t.connection.color} !important;
                stroke: ${t.connection.color} !important;
                stroke-width: ${t.connection.width}px !important;
            }

            .drawflow .connection:hover .point {
                fill: ${t.connection.hover.color} !important;
                stroke: ${t.connection.hover.color} !important;
            }

            .drawflow .connection.selected .point {
                fill: ${t.connection.selected.color} !important;
                stroke: ${t.connection.selected.color} !important;
            }

            /* Node Content Styling */
            .node-content {
                padding: 10px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .node-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
                font-weight: bold;
            }

            .node-icon {
                margin-right: 8px;
                font-size: 16px;
            }

            .node-title {
                font-size: 14px;
            }

            .node-body {
                font-size: 12px;
            }

            .node-field {
                margin-bottom: 4px;
            }

            .node-field label {
                font-weight: bold;
                color: #666;
            }

            .node-field span {
                margin-left: 4px;
            }

            /* Input/Output Points */
            .drawflow .drawflow-node .input,
            .drawflow .drawflow-node .output {
                background-color: ${t.node.borderColor} !important;
                border: 2px solid ${t.node.backgroundColor} !important;
            }

            .drawflow .drawflow-node .input:hover,
            .drawflow .drawflow-node .output:hover {
                background-color: ${t.connection.hover.color} !important;
            }
        `;
    }

    private updateCSSOutput(): void {
        const cssOutput = document.getElementById('cssOutput');
        if (cssOutput) {
            cssOutput.textContent = this.generateCSS();
        }
    }

    public exportCSS(): void {
        const css = this.generateCSS();
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawflow-theme.css';
        a.click();
        URL.revokeObjectURL(url);
    }

    public copyCSS(): void {
        const css = this.generateCSS();
        navigator.clipboard.writeText(css).then(() => {
            // Show feedback
            const button = event?.target as HTMLButtonElement;
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.background = '#28a745';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy CSS: ', err);
            alert('Failed to copy CSS to clipboard');
        });
    }

    public resetTheme(): void {
        if (confirm('Are you sure you want to reset the theme to default values?')) {
            // Reset all form inputs to default values
            const resetValue = (id: string, value: string): void => {
                const element = document.getElementById(id) as HTMLInputElement;
                if (element) element.value = value;
            };

            resetValue('bgColor', '#ffffff');
            resetValue('bgColorText', '#ffffff');
            resetValue('bgSize', '20');
            resetValue('bgSizeValue', '20');
            resetValue('lineColor', '#000000');
            resetValue('lineColorText', '#000000');

            resetValue('nodeBgColor', '#ffffff');
            resetValue('nodeBgColorText', '#ffffff');
            resetValue('nodeTextColor', '#000000');
            resetValue('nodeTextColorText', '#000000');
            resetValue('nodeBorderSize', '2');
            resetValue('nodeBorderSizeValue', '2');
            resetValue('nodeBorderColor', '#cccccc');
            resetValue('nodeBorderColorText', '#cccccc');
            resetValue('nodeBorderRadius', '8');
            resetValue('nodeBorderRadiusValue', '8');
            resetValue('nodeMinHeight', '80');
            resetValue('nodeMinHeightValue', '80');
            resetValue('nodeMinWidth', '150');
            resetValue('nodeMinWidthValue', '150');
            resetValue('nodePaddingTop', '10');
            resetValue('nodePaddingTopValue', '10');
            resetValue('nodePaddingBottom', '10');
            resetValue('nodePaddingBottomValue', '10');

            resetValue('nodeShadowH', '2');
            resetValue('nodeShadowHValue', '2');
            resetValue('nodeShadowV', '2');
            resetValue('nodeShadowVValue', '2');
            resetValue('nodeShadowBlur', '4');
            resetValue('nodeShadowBlurValue', '4');
            resetValue('nodeShadowSpread', '0');
            resetValue('nodeShadowSpreadValue', '0');
            resetValue('nodeShadowColor', '#000000');
            resetValue('nodeShadowColorText', '#000000');

            resetValue('nodeHoverBgColor', '#f8f9fa');
            resetValue('nodeHoverBgColorText', '#f8f9fa');
            resetValue('nodeHoverTextColor', '#000000');
            resetValue('nodeHoverTextColorText', '#000000');

            resetValue('nodeSelectedBgColor', '#e3f2fd');
            resetValue('nodeSelectedBgColorText', '#e3f2fd');
            resetValue('nodeSelectedBorderColor', '#2196f3');
            resetValue('nodeSelectedBorderColorText', '#2196f3');

            resetValue('connectionWidth', '3');
            resetValue('connectionWidthValue', '3');
            resetValue('connectionColor', '#000000');
            resetValue('connectionColorText', '#000000');
            resetValue('connectionHoverColor', '#666666');
            resetValue('connectionHoverColorText', '#666666');
            resetValue('connectionSelectedColor', '#2196f3');
            resetValue('connectionSelectedColorText', '#2196f3');

            this.updateTheme();
        }
    }
}

// Global functions for button clicks
let themeGenerator: ThemeGenerator;

function addSampleNode(type: string): void {
    themeGenerator.addSampleNode(type);
}

function clearCanvas(): void {
    themeGenerator.clearCanvas();
}

function exportData(): void {
    themeGenerator.exportData();
}

function importData(): void {
    themeGenerator.importData();
}

function deleteSelected(): void {
    if (themeGenerator.selectedNode) {
        themeGenerator.deleteNode(themeGenerator.selectedNode);
    } else {
        alert('Please select a node first');
    }
}

function resetTheme(): void {
    themeGenerator.resetTheme();
}

function exportCSS(): void {
    themeGenerator.exportCSS();
}

function copyCSS(): void {
    themeGenerator.copyCSS();
}

// Export functions to global scope for HTML compatibility
(window as any).addSampleNode = addSampleNode;
(window as any).clearCanvas = clearCanvas;
(window as any).exportData = exportData;
(window as any).importData = importData;
(window as any).deleteSelected = deleteSelected;
(window as any).resetTheme = resetTheme;
(window as any).exportCSS = exportCSS;
(window as any).copyCSS = copyCSS;

// Initialize the theme generator when the page loads
document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
    themeGenerator = new ThemeGenerator();
    await themeGenerator.init();
});
