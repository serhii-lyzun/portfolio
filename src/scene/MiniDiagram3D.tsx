import { useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  Vector3,
  type Group,
} from 'three'
import type { CaseStudy, DiagramMedia } from '@/content/types'
import { diagramLayout } from '@/lib/diagramLayout'
import { glowTexture } from './glowTexture'
import { useLabelPortal } from './LabelPortal'
import { useScene } from './SceneContext'

/** Width per diagram column and box height in scene units, and the offset from the crystal */
const COLUMN_WIDTH = 1.2
const HEIGHT = 2
const OFFSET = new Vector3(0, -2.3, 0.8)

/**
 * For cases without screenshots (AI & MCP, NDA): the architecture diagram unfolds under the
 * crystal in 3D, with packets flowing along its edges (plan § 3).
 */
export function MiniDiagram3D({ item, diagram }: { item: CaseStudy; diagram: DiagramMedia }) {
  const { live } = useScene()
  const portal = useLabelPortal()
  const group = useRef<Group>(null!)
  const target = useMemo(() => new Vector3(), [])

  const { points, lines, packets, progress } = useMemo(() => {
    const { pos, columns } = diagramLayout(diagram, false)
    const width = columns * COLUMN_WIDTH
    const points = new Map<string, Vector3>()
    for (const node of diagram.nodes) {
      const p = pos.get(node.id)!
      points.set(node.id, new Vector3((p.x / 100 - 0.5) * width, (0.5 - p.y / 100) * HEIGHT, 0))
    }
    const color = new Color(item.node.color)

    const segments = new Float32Array(diagram.edges.length * 6)
    diagram.edges.forEach(([from, to], i) => {
      points.get(from)!.toArray(segments, i * 6)
      points.get(to)!.toArray(segments, i * 6 + 3)
    })
    const lineGeometry = new BufferGeometry()
    lineGeometry.setAttribute('position', new BufferAttribute(segments, 3))
    const lines = new LineSegments(
      lineGeometry,
      new LineBasicMaterial({ color, transparent: true, opacity: 0.45, depthWrite: false }),
    )

    const packetGeometry = new BufferGeometry()
    packetGeometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(diagram.edges.length * 3), 3),
    )
    const packets = new Points(
      packetGeometry,
      new PointsMaterial({
        color,
        map: glowTexture(),
        size: 0.3,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    )
    return { points, lines, packets, progress: { t: 0 } }
  }, [diagram, item.node.color])

  const point = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    const node = live.get(item.slug)
    if (!node) return
    target.copy(node).add(OFFSET)
    easing.damp3(group.current.position, target, 0.35, delta)
    easing.damp3(group.current.scale, 1, 0.35, delta)

    progress.t = (progress.t + delta * 0.6) % 1
    const attr = packets.geometry.attributes.position as BufferAttribute
    diagram.edges.forEach(([from, to], i) => {
      point.lerpVectors(points.get(from)!, points.get(to)!, progress.t)
      attr.setXYZ(i, point.x, point.y, point.z)
    })
    attr.needsUpdate = true
  })

  return (
    <group ref={group} scale={0.01}>
      <primitive object={lines} />
      <primitive object={packets} />
      {diagram.nodes.map((n) => (
        <Html
          key={n.id}
          portal={portal}
          center
          position={points.get(n.id)!.toArray()}
          zIndexRange={[20, 0]}
          pointerEvents="none"
        >
          <div
            className="w-max max-w-[9rem] rounded-lg border bg-night-800/95 px-3 py-1.5 text-center shadow-lg shadow-black/40 select-none"
            style={{ borderColor: `${item.node.color}66` }}
          >
            <p className="text-xs font-medium text-ink">{n.label}</p>
            {n.detail && <p className="text-[10px] text-ink-muted">{n.detail}</p>}
          </div>
        </Html>
      ))}
    </group>
  )
}
