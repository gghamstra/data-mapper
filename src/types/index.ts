// Type definitions for the theme generator application

export interface ThemeConfig {
  background: {
    color: string;
    size: number;
    lineColor: string;
  };
  node: {
    backgroundColor: string;
    textColor: string;
    borderSize: number;
    borderColor: string;
    borderRadius: number;
    minHeight: number;
    minWidth: number;
    paddingTop: number;
    paddingBottom: number;
    shadow: {
      horizontal: number;
      vertical: number;
      blur: number;
      spread: number;
      color: string;
    };
    hover: {
      backgroundColor: string;
      textColor: string;
    };
    selected: {
      backgroundColor: string;
      borderColor: string;
    };
  };
  connection: {
    width: number;
    color: string;
    hover: {
      color: string;
    };
    selected: {
      color: string;
    };
  };
}

export interface NodeOptions {
  x?: number;
  y?: number;
  data?: Record<string, any>;
}

export interface TouchEvent extends Event {
  touches: TouchList;
  target: EventTarget | null;
}

export interface DragEvent extends Event {
  dataTransfer: DataTransfer | null;
  clientX: number;
  clientY: number;
  target: EventTarget | null;
}

export interface DropEvent extends Event {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer | null;
  preventDefault(): void;
}

export interface MouseEvent extends Event {
  clientX: number;
  clientY: number;
  target: EventTarget | null;
}

export interface NodeType {
  type: 'input' | 'transform' | 'filter' | 'output' | 'facebook' | 'slack' | 'github' | 'telegram' | 'aws' | 'log' | 'google' | 'email' | 'template' | 'multiple' | 'personalized' | 'dbclick';
}

export interface SampleDataResponse {
  drawflow: {
    [moduleName: string]: {
      data: Record<string, any>;
    };
  };
}
