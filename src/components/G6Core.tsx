import * as React from 'react';
import G6, {ModelStyle} from '@antv/g6';
import {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {Box, Checkbox, FormControl, FormControlLabel, FormLabel, Slider, Typography} from '@mui/material';
import chroma from 'chroma-js';
import config from '@/config';
import {IDataset} from '@/types';

export interface IG6CoreProps {
}

const G6Core = (props: IG6CoreProps) => {
  const GRAPH_HEIGHT = config.appearance.g6CoreHeight;
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  const {selectedDataset, dataset, qares} = useAppSelector((state) => state.site);
  const [graph, setGraph] = React.useState<any>(null);
  const [gdata, setGdata] = React.useState<any>(null);
  const [currentRenderedGraph, setCurrentRenderedGraph] = React.useState<any>(null);

  // Graph config
  const [showLabel, setShowLabel] = React.useState(false);
  const [nodeSize, setNodeSize] = React.useState(10);
  const [linkDistance, setLinkDistance] = React.useState(60);
  const [nodeStrength, setNodeStrength] = React.useState( -30);

  const nodeFills = dataset.graphjson.nodes.map((node: any) => {
    return chroma.scale('Set1').mode('lch').domain([0, 1]).colors(dataset.community_count)[node.group];
  });

  const directed = dataset.graphconfig.graph.directed;

  /**
   * Graph initialization
   */
  useEffect(() => {
    if (!graph || selectedDataset != currentRenderedGraph) {
      if (graph) {
        graph.destroy();
      }

      const refreshDraggedNodePosition = (e: any) => {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      };

      const g = new G6.Graph({
        container: ref.current,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: linkDistance,
          nodeStrength: nodeStrength,
          clustering: true,
          clusterNodeStrength: -5,
          nodeSpacing: 5,
        },
        modes: {
          default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
        },
        width: ref.current.clientWidth,
        height: GRAPH_HEIGHT,
        defaultNode: {
          size: nodeSize,
          label: '',
          labelCfg: {
            position: 'right',
            style: {
              fill: '#000000',
              opacity: 0.8,
              fontSize: 12,
              fontFamily: 'PragmataPro',
            },
          },
          style: {
            fill: chroma.random().hex(),
            strokeOpacity: 0,
          },
        },
      });

      fetch(`/dataset/${selectedDataset}.json`)
          .then((res) => res.json())
          .then((data: IDataset) => {
            const gdata = data.graphjson;
            g.data(gdata);
            gdata.nodes.forEach((i: ModelStyle, index: number) => {
              i.cluster = i.group;
              i.style = {...i.style,
                fill: nodeFills[index],
              };
              i.stateStyles = {
                highlight: {
                  stroke: '#C70000',
                  strokeOpacity: 1,
                  lineWidth: 2,
                  fill: nodeFills[index],
                  size: 1.5 * nodeSize,
                  shadowBlur: 4 * nodeSize,
                  shadowColor: '#C70000',
                },
              };
            });
            gdata.edges.forEach((e: ModelStyle, index: number) => {
              console.log(dataset.graphconfig.graph.directed);
              // e.size = 1 + (e.value || 1 - 1) / 5 || 1;
              e.style = {...e.style,
                stroke: '#555555',
                strokeOpacity: 0.25,
                // @ts-ignore
                lineWidth: 1 + (e.value || 1 - 1) / 5 || 1,
                endArrow: data.graphconfig.graph.directed ? {
                  path: G6.Arrow.triangle(5, 5, 5),
                  d: 5,
                  fill: '#555555',
                } : false,
              };
              e.stateStyles = {
                highlight: {
                  stroke: '#C70000',
                  strokeOpacity: 1,
                  // @ts-ignore
                  lineWidth: 1 + (e.value || 1 - 1) / 5 || 1,
                  shadowBlur: 20,
                  shadowColor: '#C70000',
                },
              };
            });

            setGdata(data.graphjson);
            g.render();
          });

      g.on('node:dragstart', function(e: any) {
        g.layout();
        refreshDraggedNodePosition(e);
      });
      g.on('node:drag', (e: any) => {
        const forceLayout = g.get('layoutController').layoutMethods[0];
        forceLayout.execute();
        refreshDraggedNodePosition(e);
      });
      g.on('node:dragend', (e: any) => {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });
      setGraph(g);
      setCurrentRenderedGraph(selectedDataset);
    } else {
      console.log('graph exist!!!!!');
    }
  }, [selectedDataset]);

  useEffect(() => {
    if (!gdata || !graph) return;
    gdata.nodes.forEach((i: any) => {
      i.size = nodeSize;
      i.label = showLabel ? i.name : '';
    });
    graph.refresh();
    graph.layout();
  }, [showLabel, nodeSize]);

  useEffect(() => {
    if (!gdata || !graph) return;

    graph.updateLayout({
      linkDistance: linkDistance,
      nodeStrength: nodeStrength,
    });
  }, [nodeStrength, linkDistance]);

  useEffect(() => {
    if (!gdata || !graph || !qares) return;

    graph.getNodes().forEach((node: any) => {
      graph.setItemState(node, 'highlight', false);
    });

    graph.getEdges().forEach((edge: any, index: number) => {
      graph.setItemState(edge, 'highlight', false);
    });

    gdata.nodes.forEach((node: any) => {
      node.size = nodeSize;
      node.label = showLabel ? node.name : '';
    });

    graph.refresh();
    graph.layout();

    // Set new highlights
    const highlight: any = qares.highlight;
    if (highlight) {
      if (highlight.type == 'node' || highlight.type == 'community') {
        const highlightNode = highlight.node_index;
        highlightNode.forEach((one: number) => {
          graph.setItemState(graph.getNodes()[one], 'highlight', true);
          gdata.nodes[one].size = 1.5 * nodeSize;
          gdata.nodes[one].label = gdata.nodes[one].name;
        });
      }
      if (highlight.type == 'edge') {
        highlight.edge_index.forEach((one: any) => {
          const highlightEdge = graph.getEdges().filter((e: any) => {
            return e.getModel().source == one.source && e.getModel().target == one.target;
          });
          if (highlightEdge.length > 0) {
            graph.setItemState(highlightEdge[0], 'highlight', true);
            // Display name of the edge
            gdata.nodes[one.source].label = gdata.nodes[one.source].name;
            gdata.nodes[one.target].label = gdata.nodes[one.target].name;
          }
        });
      }
    }

    // graph.setItemState(graph.getEdges()[1], 'highlight', true);

    graph.refresh();
    graph.layout();
  }, [qares]);

  return (
    <Box sx={{position: 'relative'}}>
      <Box ref={ref} sx={{height: `{GRAPH_WIDTH}px`, width: '100%', py: 2, position: 'absolute'}} />
      <Box sx={{position: 'absolute', my: 2, width: '150px'}}>
        <Box>
          <FormControlLabel control={
            <Checkbox size={'small'} checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} />
          } label={'Show Label'} />
        </Box>
        <Typography variant="body2">Node Size ({nodeSize}):</Typography>
        <Slider size={'small'}
          value={nodeSize} min={2} max={30} onChange={(event, value) => setNodeSize(value as number)} />
        <Typography variant="body2">Node Strength ({nodeStrength.toFixed(2)}):</Typography>
        <Slider size={'small'}
          value={-nodeStrength} min={-20} max={150} onChange={(event, value) => setNodeStrength(-value as number)} />
        <Typography variant="body2">Link Distance ({linkDistance.toFixed(2)}):</Typography>
        <Slider size={'small'}
          value={linkDistance} min={5} max={300} onChange={(event, value) => setLinkDistance(value as number)} />
      </Box>
    </Box>
  );
};

export default G6Core;
