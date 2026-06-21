import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  MarkerType,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { SceneNodeSpec, SceneSpec } from '../../types/scene.ts'
import { resolveGrid } from '../../data/layout/grid.ts'
import { GRAY } from '../../data/colors.ts'
import { SceneNode, type SceneNodeData } from './SceneNode.tsx'
import { FlowEdge } from './FlowEdge.tsx'
import './scene.css'

const nodeTypes = { scene: SceneNode }
const edgeTypes = { flow: FlowEdge }

/** Flatten the scene tree, parent before each of its children (depth-first). */
function flattenNodes(nodes: SceneNodeSpec[]): SceneNodeSpec[] {
  const out: SceneNodeSpec[] = []
  for (const n of nodes) {
    out.push(n)
    if (n.children?.length) out.push(...flattenNodes(n.children))
  }
  return out
}

// Virtual portrait canvas; React Flow's fitView scales it to the real viewport.
const CANVAS = { width: 800, height: 1200 }

export function SceneCanvas({ scene, active }: { scene: SceneSpec; active: boolean }) {
  const direction = scene.grid.cols > scene.grid.rows ? 'horizontal' : 'vertical'

  const nodes = useMemo<Node<SceneNodeData>[]>(() => {
    const boxes = resolveGrid(scene.nodes, scene.grid, CANVAS)
    // Depth-first, parent before child: React Flow paints in array order, so
    // containers land behind the children resolved inside them.
    const flat = flattenNodes(scene.nodes)
    return flat.map((n, i) => {
      const box = boxes[n.id]
      return {
        id: n.id,
        type: 'scene',
        position: { x: box.x, y: box.y },
        draggable: false,
        selectable: false,
        data: {
          label: n.label,
          sub: n.sub,
          color: n.color ?? GRAY,
          kind: n.kind ?? 'symbol',
          lang: n.lang,
          direction,
          index: i,
          active,
          width: box.w,
          height: box.h,
        },
      }
    })
  }, [scene, direction, active])

  const edges = useMemo<Edge[]>(
    () =>
      scene.edges.map((e, i) => ({
        id: `${e.from}-${e.to}-${i}`,
        source: e.from,
        target: e.to,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        type: 'flow',
        label: e.label,
        data: { color: e.color ?? GRAY, animated: e.animated },
        markerEnd: { type: MarkerType.ArrowClosed, color: e.color ?? GRAY },
      })),
    [scene],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.12 }}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
    >
      <Background color="#1b1d29" gap={28} />
    </ReactFlow>
  )
}
