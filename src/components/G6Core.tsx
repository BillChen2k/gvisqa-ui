import * as React from 'react';
import G6, {ModelStyle} from '@antv/g6';
import {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Slider, Typography} from '@mui/material';
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
  const [isStatic, setIsStatic] = React.useState(false);
  const [nodeSize, setNodeSize] = React.useState(10);
  const [linkDistance, setLinkDistance] = React.useState(60);
  const [nodeStrength, setNodeStrength] = React.useState( 30);

  const directed = dataset.graphconfig.graph.directed;


  /**
   * Graph initialization
   */
  useEffect(() => {
    if (!graph || selectedDataset != currentRenderedGraph) {
      if (graph) {
        graph.destroy();
      }

      fetch(`/dataset/${selectedDataset}.json`)
          .then((res) => res.json())
          .then((data: IDataset) => {
            const gdata = data.graphjson;

            const refreshDraggedNodePosition = (e: any) => {
              const model = e.item.get('model');
              model.fx = e.x;
              model.fy = e.y;
              model.x = e.x;
              model.y = e.y;
            };

            const scale = chroma.scale('Set1').mode('lch').domain([0, 1]).colors(data.community_count);
            const nodeFills = data.graphjson.nodes.map((node: any) => {
              return scale[node.group];
            });

            const tooltip = new G6.Tooltip({
              offsetX: 10,
              offsetY: 10,
              fixToNode: [1, 0.5],
              itemTypes: ['node', 'edge'],
              getContent: (e) => {
                const outDiv = document.createElement('div');
                const model = e.item.getModel();
                outDiv.style.width = 'fit-content';
                outDiv.style.height = 'fit-content';
                if (e.item.getType() === 'node') {
                  // @ts-ignore
                  const properties: any = data.properties.node[String(model.id)];
                  let content = `<div><b>${model.name}</b></div>`;
                  content += `<div>Degree: ${properties.degree}</div>`;
                  content += `<div>Clustering: ${Number(properties.clustering).toFixed(4)}</div>`;
                  content += `<div>Degree Centrality: ${Number(properties.degree_centrality).toFixed(4)}</div>`;
                  content += `<div>Within Community: ${model.group}</div>`;

                  outDiv.innerHTML = content;
                } else {
                  let properties = data.properties.edge[String(model.source)][String(model.target)];
                  if (!properties) {
                    properties = data.properties.edge[String(model.target)][String(model.source)];
                  }
                  let content = `<div><b>${properties.from_name} - ${properties.to_name}</b></div>`;
                  content += `<div>Weight: ${model.value}</div>`;
                  outDiv.innerHTML = content;
                }
                return outDiv;
              },
            });

            const g = new G6.Graph({
              container: ref.current,
              layout: {
                type: 'force',
                preventOverlap: true,
                // gravity: 10,
                linkDistance: linkDistance,
                nodeStrength: -nodeStrength,
                // clustering: true,
                // clusterNodeStrength: -5,
                // nodeSpacing: 5,
                // workerEnabled: true,
                gpuEnabled: true,
                maxIteration: 50,
              },
              plugins: [tooltip],
              modes: {
                default: ['zoom-canvas', 'drag-canvas'],
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
                  strokeOpacity: 0,
                },
              },
            });

            g.data(gdata);
            gdata.nodes.forEach((i: ModelStyle, index: number) => {
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

            // g.on('node:dragstart', function(e) {
            //   const forceLayout = g.get('layoutController').layoutMethods[0];
            //   forceLayout.stop();
            // });
            //
            // g.on('node:drag', function(e) {
            //   refreshDraggedNodePosition(e);
            //   g.layout();
            // });

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

            setGdata(data.graphjson);
            g.render();
          });

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
    const forceLayout = graph.get('layoutController').layoutMethods[0];
    if (isStatic) {
      forceLayout.stop();
    } else {
      forceLayout.start();
    }
  }, [isStatic]);

  useEffect(() => {
    if (!gdata || !graph) return;

    graph.updateLayout({
      linkDistance: linkDistance,
      nodeStrength: nodeStrength,
    });
  }, [nodeStrength, linkDistance]);

  useEffect(() => {

    if (!gdata || !graph) return;

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

    if (!qares) return;

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
        const focusItem = graph.getNodes()[highlightNode[0]];
        graph.focusItem(focusItem, true, {
          easing: 'easeCubic',
          duration: 600,
        });
      }
      if (highlight.type == 'edge') {
        highlight.edge_index.forEach((one: any, index: number) => {
          const highlightEdge = graph.getEdges().filter((e: any) => {
            return e.getModel().source == one.source && e.getModel().target == one.target;
          });
          if (highlightEdge.length > 0) {
            graph.setItemState(highlightEdge[0], 'highlight', true);
            // Display name of the edge
            gdata.nodes[one.source].label = gdata.nodes[one.source].name;
            gdata.nodes[one.target].label = gdata.nodes[one.target].name;
            if (index == 0) {
              const focusItem = highlightEdge[0];
              graph.focusItem(focusItem, true, {
                easing: 'easeCubic',
                duration: 600,
              });
            }
          }
        });
      }
      setTimeout(() => {
        graph.zoomTo(1.5, {
          x: ref.current.clientWidth / 2,
          y: ref.current.clientHeight / 2,
        }, true, {
          easing: 'easeCubic',
          duration: 500,
        });
      }, 700);
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
        {/* <Box>*/}
        {/*  <FormControlLabel control={*/}
        {/*    <Checkbox size={'small'} checked={isStatic} onChange={(e) => setIsStatic(e.target.checked)} />*/}
        {/*  } label={'Static Layout'} />*/}
        {/* </Box>*/}
        <Typography variant="body2">Node Size ({nodeSize}):</Typography>
        <Slider size={'small'}
          value={nodeSize} min={2} max={30} onChange={(event, value) => setNodeSize(value as number)} />
        <Typography variant="body2">Node Strength ({nodeStrength.toFixed(4)}):</Typography>
        <Slider size={'small'}
          value={nodeStrength} min={-50} max={50} onChange={(event, value) => setNodeStrength(value as number)} />
        <Typography variant="body2">Link Distance ({linkDistance.toFixed(4)}):</Typography>
        <Slider size={'small'}
          value={linkDistance} min={5} max={300} onChange={(event, value) => setLinkDistance(value as number)} />
        <Button variant={'outlined'} size={'small'}
          onClick={() => {
            graph.downloadFullImage('graph');
          }}>
          Download Graph
        </Button>
      </Box>
    </Box>
  );
};

export default G6Core;
