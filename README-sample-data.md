# Sample Data for Drawflow Theme Generator

This directory contains sample data files for the Drawflow Theme Generator.

## Files

### `sample-data.json`
Contains a comprehensive set of sample nodes and connections that demonstrate various Drawflow features:

- **Welcome Node**: Introduction and feature overview
- **Social Media Nodes**: Slack, Telegram, Facebook integration examples
- **Communication Nodes**: Email and template nodes
- **Data Source Nodes**: GitHub integration example
- **Utility Nodes**: Logging and file operations
- **Interactive Nodes**: Double-click functionality and modal dialogs
- **Multi-connection Nodes**: Examples of nodes with multiple inputs/outputs

## Structure

The JSON file follows the Drawflow export format:

```json
{
  "drawflow": {
    "Home": {
      "data": {
        "node_id": {
          "id": "unique_id",
          "name": "node_name",
          "data": {},
          "class": "css_class",
          "html": "node_html_content",
          "typenode": false,
          "inputs": {},
          "outputs": {},
          "pos_x": 100,
          "pos_y": 100
        }
      }
    },
    "Other": {
      "data": {
        // Additional modules/nodes
      }
    }
  }
}
```

## Usage

The theme generator automatically loads this sample data when it starts. If the file is not found or fails to load, the application will fall back to creating basic sample nodes.

## Customization

You can modify this file to:
- Add your own sample nodes
- Change node positions
- Update node content and styling
- Add new modules/sections

## Node Types Included

1. **Welcome Node** (`welcome`): Introduction and feature list
2. **Slack Node** (`slack`): Slack integration example
3. **Telegram Node** (`telegram`): Telegram bot with channel selection
4. **Email Node** (`email`): Email sending functionality
5. **Template Node** (`template`): Template processing with variables
6. **GitHub Node** (`github`): GitHub repository integration
7. **Facebook Node** (`facebook`): Facebook messaging
8. **Log Node** (`log`): File logging functionality
9. **Personalized Node** (`personalized`): Custom node example
10. **Double-click Node** (`dbclick`): Interactive node with modal
11. **Multiple Node** (`multiple`): Node with multiple inputs/outputs

## Connections

The sample data includes various connection patterns:
- Simple linear flows
- Branching connections
- Multiple input connections
- Multiple output connections
- Cross-module connections

This provides a comprehensive example for testing theme customization across different node types and connection patterns.
