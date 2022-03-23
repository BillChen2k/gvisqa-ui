export interface IHighlight {
  type: 'node' | 'community' | 'edge';
  node_index?: number[];
  community_index?: number[];
}

export interface IQAResult {
  id: string;
  question: string;
  answer: string[] | number[];
  highlight: IHighlight[];
  answer_properties: any[];
  answer_type: string;
  readable_answer: string;
  cp: string; // Candidate Path
  query: string;
  te: any[];
}

export interface IGraphConfig {
  graph: any;
  node: any;
  community: any;
  edge: any;
}

// export interface IGraphJson {
//   nodes: any[];
//   edges: any[];
// }

export interface IDataset {
  name: string;
  full_name: string;
  description: string;
  edge_count: number;
  node_count: number;
  community_count: number;
  graphconfig: IGraphConfig;
  graphjson: any;
  qares: IQAResult[];
  properties: {
    node: any;
    edge: any;
    community: any;
  }
}
