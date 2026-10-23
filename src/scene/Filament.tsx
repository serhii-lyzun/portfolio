import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Vector3,
} from 'three'
import { glowTexture } from './glowTexture'
import { edgeTouches, type Edge } from './layout'
import { useScene } from './SceneContext'

const SEGMENTS = 32
const PACKETS = 3

/**
 * A light filament between two nodes with data packets flowing along it.
 * Gently curved, brightens and speeds up while one of its ends is hovered.
 */
export function Filament({ edge }: { edge: Edge }) {
  const { live, focus } = useScene()
  const active = edgeTouches(edge, focus)
  const dimmed = focus !== null && !active

  const { line, packets, curve, state } = useMemo(() => {
    const color = new Color(edge.color)
    const lineGeometry = new BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array((SEGMENTS + 1) * 3), 3),
    )
    const line = new Line(
      lineGeometry,
      new LineBasicMaterial({ color, transparent: true, opacity: 0.25, depthWrite: false }),
    )
    line.frustumCulled = false

    const packetGeometry = new BufferGeometry()
    packetGeometry.setAttribute('position', new BufferAttribute(new Float32Array(PACKETS * 3), 3))
    const packets = new Points(
      packetGeometry,
      new PointsMaterial({
        color,
        map: glowTexture(),
        size: 0.32,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    )
    packets.frustumCulled = false

    const curve = new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3())
    return {
      line,
      packets,
      curve,
      state: { progress: (edge.from.length * 0.37 + edge.to.length * 0.11) % 1, speed: 0.18 },
    }
  }, [edge.color, edge.from, edge.to])

  const point = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    const a = live.get(edge.from)
    const b = live.get(edge.to)
    if (!a || !b) return

    // Control point lifted off the straight line so filaments read as arcs
    curve.v0.copy(a)
    curve.v2.copy(b)
    curve.v1.addVectors(a, b).multiplyScalar(0.5)
    curve.v1.y += a.distanceTo(b) * 0.12

    const linePositions = line.geometry.attributes.position as BufferAttribute
    for (let i = 0; i <= SEGMENTS; i++) {
      curve.getPoint(i / SEGMENTS, point)
      linePositions.setXYZ(i, point.x, point.y, point.z)
    }
    linePositions.needsUpdate = true

    easing.damp(state, 'speed', active ? 0.7 : 0.18, 0.3, delta)
    state.progress = (state.progress + delta * state.speed) % 1
    const packetPositions = packets.geometry.attributes.position as BufferAttribute
    for (let i = 0; i < PACKETS; i++) {
      curve.getPoint((state.progress + i / PACKETS) % 1, point)
      packetPositions.setXYZ(i, point.x, point.y, point.z)
    }
    packetPositions.needsUpdate = true

    const lineMaterial = line.material as LineBasicMaterial
    easing.damp(lineMaterial, 'opacity', active ? 0.85 : dimmed ? 0.08 : 0.25, 0.2, delta)
    easing.damp(packets.material as PointsMaterial, 'opacity', dimmed ? 0.15 : 0.9, 0.2, delta)
  })

  return (
    <>
      <primitive object={line} />
      <primitive object={packets} />
    </>
  )
}
