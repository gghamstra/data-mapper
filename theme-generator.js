// Drawflow Theme Generator
class ThemeGenerator {
    constructor() {
        this.editor = null;
        this.nodeCounter = 0;
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

    async init() {
        // Initialize Drawflow
        const container = document.getElementById('drawflow');
        this.editor = new Drawflow(container);
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

    setupEventListeners() {
        // Node events
        this.editor.on('nodeCreated', (id) => {
            console.log('Node created:', id);
        });

        this.editor.on('nodeSelected', (id) => {
            console.log('Node selected:', id);
        });

        this.editor.on('connectionCreated', (connection) => {
            console.log('Connection created:', connection);
        });
    }

    setupInputSync() {
        // Sync color inputs with text inputs
        const colorInputs = document.querySelectorAll('input[type="color"]');
        colorInputs.forEach(input => {
            const textInput = document.getElementById(input.id + 'Text');
            if (textInput) {
                input.addEventListener('change', () => {
                    textInput.value = input.value;
                });
            }
        });

        // Sync range inputs with number inputs
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            const numberInput = document.getElementById(input.id + 'Value');
            if (numberInput) {
                input.addEventListener('input', () => {
                    numberInput.value = input.value;
                });
                numberInput.addEventListener('change', () => {
                    input.value = numberInput.value;
                });
            }
        });
    }

    async addInitialNodes() {
        // Try to load sample data from JSON file first
        try {
            const response = await fetch('sample-data.json');
            const sampleData = await response.json();
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

    addSampleNode(type, options = {}) {
        this.nodeCounter++;
        const nodeId = `node-${this.nodeCounter}`;
        const x = options.x || Math.random() * 600 + 200;
        const y = options.y || Math.random() * 300 + 100;

        let html, inputs, outputs, className;

        switch (type) {
            case 'input':
                className = 'input-node';
                html = `
                    <div class="node-content">
                        <div class="node-header">
                            <span class="node-icon">📥</span>
                            <span class="node-title">Data Input</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Source:</label>
                                <span>Database</span>
                            </div>
                            <div class="node-field">
                                <label>Table:</label>
                                <span>users</span>
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
                    <div class="node-content">
                        <div class="node-header">
                            <span class="node-icon">🔄</span>
                            <span class="node-title">Transform</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Operation:</label>
                                <span>Join</span>
                            </div>
                            <div class="node-field">
                                <label>Table:</label>
                                <span>orders</span>
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
                    <div class="node-content">
                        <div class="node-header">
                            <span class="node-icon">📤</span>
                            <span class="node-title">Data Output</span>
                        </div>
                        <div class="node-body">
                            <div class="node-field">
                                <label>Destination:</label>
                                <span>API</span>
                            </div>
                            <div class="node-field">
                                <label>Endpoint:</label>
                                <span>/users</span>
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
            {},
            html,
            false
        );
    }

    updateTheme() {
        // Update theme object from form inputs
        this.theme.background.color = document.getElementById('bgColor').value;
        this.theme.background.size = parseInt(document.getElementById('bgSize').value);
        this.theme.background.lineColor = document.getElementById('lineColor').value;

        this.theme.node.backgroundColor = document.getElementById('nodeBgColor').value;
        this.theme.node.textColor = document.getElementById('nodeTextColor').value;
        this.theme.node.borderSize = parseInt(document.getElementById('nodeBorderSize').value);
        this.theme.node.borderColor = document.getElementById('nodeBorderColor').value;
        this.theme.node.borderRadius = parseInt(document.getElementById('nodeBorderRadius').value);
        this.theme.node.minHeight = parseInt(document.getElementById('nodeMinHeight').value);
        this.theme.node.minWidth = parseInt(document.getElementById('nodeMinWidth').value);
        this.theme.node.paddingTop = parseInt(document.getElementById('nodePaddingTop').value);
        this.theme.node.paddingBottom = parseInt(document.getElementById('nodePaddingBottom').value);

        this.theme.node.shadow.horizontal = parseInt(document.getElementById('nodeShadowH').value);
        this.theme.node.shadow.vertical = parseInt(document.getElementById('nodeShadowV').value);
        this.theme.node.shadow.blur = parseInt(document.getElementById('nodeShadowBlur').value);
        this.theme.node.shadow.spread = parseInt(document.getElementById('nodeShadowSpread').value);
        this.theme.node.shadow.color = document.getElementById('nodeShadowColor').value;

        this.theme.node.hover.backgroundColor = document.getElementById('nodeHoverBgColor').value;
        this.theme.node.hover.textColor = document.getElementById('nodeHoverTextColor').value;

        this.theme.node.selected.backgroundColor = document.getElementById('nodeSelectedBgColor').value;
        this.theme.node.selected.borderColor = document.getElementById('nodeSelectedBorderColor').value;

        this.theme.connection.width = parseInt(document.getElementById('connectionWidth').value);
        this.theme.connection.color = document.getElementById('connectionColor').value;
        this.theme.connection.hover.color = document.getElementById('connectionHoverColor').value;
        this.theme.connection.selected.color = document.getElementById('connectionSelectedColor').value;

        // Apply theme to the editor
        this.applyTheme();
        
        // Update CSS output
        this.updateCSSOutput();
    }

    updateThemeFromText() {
        // Update color inputs from text inputs
        const textInputs = document.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            if (input.id.endsWith('Text')) {
                const colorInput = document.getElementById(input.id.replace('Text', ''));
                if (colorInput && this.isValidColor(input.value)) {
                    colorInput.value = input.value;
                }
            }
        });
        this.updateTheme();
    }

    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    applyTheme() {
        const style = document.getElementById('dynamic-theme');
        if (style) {
            style.remove();
        }

        const newStyle = document.createElement('style');
        newStyle.id = 'dynamic-theme';
        newStyle.textContent = this.generateCSS();
        document.head.appendChild(newStyle);
    }

    generateCSS() {
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

    updateCSSOutput() {
        const cssOutput = document.getElementById('cssOutput');
        cssOutput.textContent = this.generateCSS();
    }

    exportCSS() {
        const css = this.generateCSS();
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawflow-theme.css';
        a.click();
        URL.revokeObjectURL(url);
    }

    copyCSS() {
        const css = this.generateCSS();
        navigator.clipboard.writeText(css).then(() => {
            // Show feedback
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy CSS: ', err);
            alert('Failed to copy CSS to clipboard');
        });
    }

    resetTheme() {
        if (confirm('Are you sure you want to reset the theme to default values?')) {
            // Reset all form inputs to default values
            document.getElementById('bgColor').value = '#ffffff';
            document.getElementById('bgColorText').value = '#ffffff';
            document.getElementById('bgSize').value = 20;
            document.getElementById('bgSizeValue').value = 20;
            document.getElementById('lineColor').value = '#000000';
            document.getElementById('lineColorText').value = '#000000';

            document.getElementById('nodeBgColor').value = '#ffffff';
            document.getElementById('nodeBgColorText').value = '#ffffff';
            document.getElementById('nodeTextColor').value = '#000000';
            document.getElementById('nodeTextColorText').value = '#000000';
            document.getElementById('nodeBorderSize').value = 2;
            document.getElementById('nodeBorderSizeValue').value = 2;
            document.getElementById('nodeBorderColor').value = '#cccccc';
            document.getElementById('nodeBorderColorText').value = '#cccccc';
            document.getElementById('nodeBorderRadius').value = 8;
            document.getElementById('nodeBorderRadiusValue').value = 8;
            document.getElementById('nodeMinHeight').value = 80;
            document.getElementById('nodeMinHeightValue').value = 80;
            document.getElementById('nodeMinWidth').value = 150;
            document.getElementById('nodeMinWidthValue').value = 150;
            document.getElementById('nodePaddingTop').value = 10;
            document.getElementById('nodePaddingTopValue').value = 10;
            document.getElementById('nodePaddingBottom').value = 10;
            document.getElementById('nodePaddingBottomValue').value = 10;

            document.getElementById('nodeShadowH').value = 2;
            document.getElementById('nodeShadowHValue').value = 2;
            document.getElementById('nodeShadowV').value = 2;
            document.getElementById('nodeShadowVValue').value = 2;
            document.getElementById('nodeShadowBlur').value = 4;
            document.getElementById('nodeShadowBlurValue').value = 4;
            document.getElementById('nodeShadowSpread').value = 0;
            document.getElementById('nodeShadowSpreadValue').value = 0;
            document.getElementById('nodeShadowColor').value = '#000000';
            document.getElementById('nodeShadowColorText').value = '#000000';

            document.getElementById('nodeHoverBgColor').value = '#f8f9fa';
            document.getElementById('nodeHoverBgColorText').value = '#f8f9fa';
            document.getElementById('nodeHoverTextColor').value = '#000000';
            document.getElementById('nodeHoverTextColorText').value = '#000000';

            document.getElementById('nodeSelectedBgColor').value = '#e3f2fd';
            document.getElementById('nodeSelectedBgColorText').value = '#e3f2fd';
            document.getElementById('nodeSelectedBorderColor').value = '#2196f3';
            document.getElementById('nodeSelectedBorderColorText').value = '#2196f3';

            document.getElementById('connectionWidth').value = 3;
            document.getElementById('connectionWidthValue').value = 3;
            document.getElementById('connectionColor').value = '#000000';
            document.getElementById('connectionColorText').value = '#000000';
            document.getElementById('connectionHoverColor').value = '#666666';
            document.getElementById('connectionHoverColorText').value = '#666666';
            document.getElementById('connectionSelectedColor').value = '#2196f3';
            document.getElementById('connectionSelectedColorText').value = '#2196f3';

            this.updateTheme();
        }
    }
}

// Global functions for button clicks
let themeGenerator;

function addSampleNode(type) {
    themeGenerator.addSampleNode(type);
}

function clearCanvas() {
    if (confirm('Are you sure you want to clear the canvas?')) {
        themeGenerator.editor.clear();
        themeGenerator.nodeCounter = 0;
        themeGenerator.addInitialNodes();
    }
}

function resetTheme() {
    themeGenerator.resetTheme();
}

function exportCSS() {
    themeGenerator.exportCSS();
}

function copyCSS() {
    themeGenerator.copyCSS();
}

// Initialize the theme generator when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    themeGenerator = new ThemeGenerator();
    await themeGenerator.init();
});
