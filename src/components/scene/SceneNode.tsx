import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import { GRAY } from '../../data/colors.ts'
import type { NodeKind } from '../../types/scene.ts'
import { highlightCode } from '../../data/highlight.ts'

export interface SceneNodeData {
  label: string
  sub?: string
  color: string
  kind: NodeKind
  /** For `kind: 'code'`: highlight.js language (defaults to 'scala'). */
  lang?: string
  /** Dominant flow direction of the scene, sets handle placement. */
  direction: 'horizontal' | 'vertical'
  /** Stagger order for the entrance animation. */
  index: number
  /** Whether the parent card is the active (visible) reel. */
  active: boolean
  width: number
  height: number
  [key: string]: unknown
}

export function SceneNode({ data }: NodeProps) {
  const d = data as SceneNodeData
  const horizontal = d.direction === 'horizontal'
  const targetPos = horizontal ? Position.Left : Position.Top
  const sourcePos = horizontal ? Position.Right : Position.Bottom

  return (
    <motion.div
      className={`scene-node scene-node--${d.kind}`}
      style={{
        width: d.width,
        height: d.height,
        borderColor: d.color,
        ['--node-color' as string]: d.color,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={d.active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay: d.active ? d.index * 0.18 : 0, duration: 0.4, ease: 'easeOut' }}
    >
      <Handle type="target" position={targetPos} className="scene-handle" isConnectable={false} />
      {d.kind === 'code' ? (
        <>
          <pre className="scene-node__code">
            <code
              className="hljs"
              dangerouslySetInnerHTML={{ __html: highlightCode(d.label, d.lang) }}
            />
          </pre>
          {d.sub && <span className="scene-node__sub">{d.sub}</span>}
        </>
      ) : (
        <>
          {d.kind !== 'group' && <span className="scene-node__label">{d.label}</span>}
          {d.kind !== 'group' && d.sub && <span className="scene-node__sub">{d.sub}</span>}
        </>
      )}
      <Handle type="source" position={sourcePos} className="scene-handle" isConnectable={false} />
      {/* Extra side handles (id'd) for loop/feedback edges; the id-less handles
          above stay the default for normal flow edges. */}
      <Handle type="source" id="r-source" position={Position.Right} className="scene-handle" isConnectable={false} />
      <Handle type="target" id="r-target" position={Position.Right} className="scene-handle" isConnectable={false} />
    </motion.div>
  )
}

SceneNode.defaultColor = GRAY
