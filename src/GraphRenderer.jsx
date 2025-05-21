import React, { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";

const GraphRenderer = ({ events, resetKey }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesRef = useRef(new DataSet());
  const edgesRef = useRef(new DataSet());

  // init the network once
  useEffect(() => {
    if (containerRef.current && !networkRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        {
          nodes: nodesRef.current,
          edges: edgesRef.current,
        },
        {
          nodes: {
            shape: "box",
            margin: 10,
            font: { size: 14 },
            color: { border: "#333", background: "#fff" },
          },
          edges: {
            arrows: { to: { enabled: false } },
            smooth: {
              type: "cubicBezier",
              forceDirection: "vertical",
              roundness: 0.4,
            },
          },
          layout: {
            hierarchical: {
              enabled: true,
              direction: "UD",
              sortMethod: "directed",
              levelSeparation: 120,
              nodeSpacing: 80,
            },
          },
          physics: false,
          interaction: {
            hover: true,
            dragNodes: true,
            zoomView: true,
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!networkRef.current) return;
    nodesRef.current.clear();
    edgesRef.current.clear();
  }, [resetKey]);

  // stream in events. add placeholder or update score
  useEffect(() => {
    if (!networkRef.current) return;

    events.forEach((evt) => {
      const { id, parent, move, score, current_player, ischance } = evt;
      const edgeId = parent ? `${parent}-${id}` : null;

      // if node doesnt exist, create it (pre‑order)
      if (!nodesRef.current.get(id)) {
        const label =
          score != null ? `${move}: ${score.toFixed(2)}` : `${move}`; // placeholder label
        nodesRef.current.add({
          id,
          label,
          color: {
            border: "#333",
            background: ischance
              ? "#ffff00" // chance nodes in yellow
              : current_player === 1
              ? "#cce5ff" // player - 1
              : "#ffcccc", // player - 2
          },
        });
      }
      // if node does exist and now has a real score, update it
      else if (score != null) {
        nodesRef.current.update({
          id,
          label: `${move}: ${score.toFixed(2)}`,
        });
      }

      // add edge once
      if (parent && edgeId && !edgesRef.current.get(edgeId)) {
        edgesRef.current.add({ id: edgeId, from: parent, to: id });
      }
    });

    // redraw
    networkRef.current.setData({
      nodes: nodesRef.current,
      edges: edgesRef.current,
    });
  }, [events]);

  // render the container
  return <div ref={containerRef} className="stream-container" />;
};

export default GraphRenderer;
