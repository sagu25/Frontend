export interface MindMapNode {
  id: string;
  title: string;
  description: string;
  type: 'root' | 'domain' | 'subtopic';
  children?: MindMapNode[];
  content?: NodeContent;
  icon?: string;
  color?: string;
}

export interface NodeContent {
  overview: string;
  keyFeatures: string[];
  benefits: string[];
  useCases?: string[];
  technologies?: string[];
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface VisualNode extends MindMapNode {
  position: NodePosition;
  isExpanded: boolean;
  isActive: boolean;
}
