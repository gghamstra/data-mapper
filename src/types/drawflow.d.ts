// Type definitions for Drawflow
declare global {
  class Drawflow {
    constructor(container: HTMLElement, render?: any, parent?: any);
    editor_mode: 'edit' | 'fixed' | 'view';
    canvas_x: number;
    canvas_y: number;
    zoom: number;
    precanvas: HTMLElement;
    container: HTMLElement;
    reroute: boolean;
    
    start(): void;
    addNode(
      name: string,
      inputs: number | Record<string, any>,
      outputs: number | Record<string, any>,
      posx: number,
      posy: number,
      className: string,
      data: Record<string, any>,
      html: string,
      typenode?: boolean
    ): void;
    removeNodeId(id: string): void;
    getNodeFromId(id: string): DrawflowNode | null;
    addConnection(
      output_id: string,
      input_id: string,
      output_class: string,
      input_class: string
    ): void;
    removeSingleConnection(
      output_id: string,
      input_id: string,
      output_class: string,
      input_class: string
    ): void;
    import(data: DrawflowData): void;
    export(): DrawflowData;
    clear(): void;
    addModule(name: string): void;
    changeModule(name: string): void;
    removeModule(name: string): void;
    zoom_in(): void;
    zoom_out(): void;
    zoom_reset(): void;
    center(): void;
    updateConnectionNodes(id: string): void;
    removeConnectionNodeId(id: string): void;
    getModuleFromNodeId(id: string): string | null;
    clearModuleSelected(): void;
    updateNodeDataFromId(id: string, data: Record<string, any>): void;
    addNodeInput(id: string): void;
    addNodeOutput(id: string): void;
    removeNodeInput(id: string, input_class: string): void;
    removeNodeOutput(id: string, output_class: string): void;
    getNodesFromName(name: string): string[];
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
  }

  interface DrawflowNode {
    id: string | number;
    name: string;
    data: Record<string, any>;
    class: string;
    html: string;
    typenode: boolean;
    inputs: Record<string, DrawflowConnection>;
    outputs: Record<string, DrawflowConnection>;
    pos_x: number;
    pos_y: number;
  }

  interface DrawflowConnection {
    connections: Array<{
      node: string;
      input?: string;
      output?: string;
    }>;
  }

  interface DrawflowData {
    drawflow: {
      [moduleName: string]: {
        data: Record<string, DrawflowNode>;
      };
    };
  }
}
