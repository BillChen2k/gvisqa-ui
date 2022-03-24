
export type InspectorType = 'community' | 'edge' | 'node' | 'graph';

const inspectorIcons: { [key in InspectorType]: string } = {
  community: '/img/icon-community.png',
  edge: '/img/icon-edge.png',
  node: '/img/icon-node.png',
  graph: '/img/icon-graph.png',
};

export default inspectorIcons;
