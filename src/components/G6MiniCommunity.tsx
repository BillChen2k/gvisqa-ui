import * as React from 'react';
import {Box} from '@mui/material';
import {useEffect} from 'react';
import G6 from '@antv/g6';
import chroma from 'chroma-js';
import {useAppSelector} from '@/app/hooks';

export interface IG6MiniCommunityProps {
  community: number | string;
  color?: string;
}


const G6MiniCommunity = (props: IG6MiniCommunityProps) => {
  const ref = React.useRef<any>(null);

  const {dataset} = useAppSelector((state) => state.site);

  const nodeFills = chroma.scale('Set1').mode('lch').domain([0, 1]).colors(dataset.community_count);

  const [graph, setGraph] = React.useState<any>(null);
  const [gdata, setGdata] = React.useState<any>(null);

  const getCommunityGraphJson = () => {
    const communityMemberIndex = dataset.properties.community[String(props.community)].member_index.map((one: any) => String(one));
    const gjson: any = {
      nodes: [],
      edges: [],
    };
    gjson.nodes = dataset.graphjson.nodes.filter((node: any) => {
      return String(node.group) == String(props.community);
    }).map((one: any) => {
      const newNode = {...one, label: one.name};
      newNode.style = {
        fill: nodeFills[Number(props.community)],
      };
      return newNode;
    });
    gjson.edges = dataset.graphjson.edges.filter((edge: any) => {
      return true;
    }).map((one: any) => {
      return {...one};
    });
    console.log(gjson);
    return gjson;
  };

  useEffect(() => {
    if (!graph) {
      const refreshDraggedNodePosition = (e: any) => {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      };

      const g = new G6.Graph({
        container: ref.current,
        fitView: true,
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 60,
          nodeStrength: -40,
          nodeSpacing: 5,
        },
        width: ref.current.clientWidth,
        height: 300,
        defaultNode: {
          size: 10,
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
      g.on('node:dragstart', function(e: any) {
        graph.layout();
        refreshDraggedNodePosition(e);
      });
      g.on('node:drag', (e: any) => {
        const forceLayout = graph.get('layoutController').layoutMethods[0];
        forceLayout.execute();
        refreshDraggedNodePosition(e);
      });
      g.on('node:dragend', (e: any) => {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });

      g.data(getCommunityGraphJson());
      g.render();
      setGraph(g);
    }
  }, []);

  return (
    <div>
      <Box ref={ref} sx={{height: '300px', width: '90%'}}/>
    </div>
  );
};

export default G6MiniCommunity;
