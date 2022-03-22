export interface IAuxiliaryAnswer {
  type: 'topicEntity' | 'table' | 'barChart' | 'gvis';
  teInfo: {
    name: string;
    semantics: string;
    type: string;
    data: any;
  };
  tableContent?: [key: string, value: string][];
  barChartContent?: any;
  vega?: any;
}

export interface IQAResult {
  id: string;
  question: string;
  answer: string[];
  vega: string;
  readableAnswer: string;
  auxiliaryAnswers: IAuxiliaryAnswer[];
  cp: string; // Candidate Path
  query: string;
}

export interface IGraphConfig {
  graph: any;
  node: any;
  community: any;
  edge: any;
}

export interface IDataset {
  name: string;
  fullName: string;
  description: string;
  nodeCount: number;
  edgeCount: number;
  graphConfig: IGraphConfig;
  graphConfigYML: string;
  vega: string;
  vegaDir: string;
  qares: IQAResult[];
}
