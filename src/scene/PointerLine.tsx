import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, Line, LineDashedMaterial, Vector3 } from 'three'
import { pointerAtDepth, useScene } from './SceneContext'

/** Thin dashed line from the cursor to the case it points at: "pointing to the use case" (§ 2.1). */
export function PointerLine() {
  const { live, pointer, pointed } = useScene()

  const line = useMemo(() => {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(6), 3))
    const l = new Line(
      geometry,
      new LineDashedMaterial({
        color: '#ffffff',
        linewidth: 1,
        dashSize: 0.2,
        gapSize: 0.12,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    )
    l.frustumCulled = false
    return l
  }, [])
  const cursor = useMemo(() => new Vector3(), [])

  useFrame(() => {
    const node = pointed ? live.get(pointed) : undefined
    const visible = !!node && pointer.active && !!pointerAtDepth(pointer.ray, node.z, cursor)
    line.visible = visible
    if (!visible || !node) return
    const positions = line.geometry.attributes.position as BufferAttribute
    positions.setXYZ(0, cursor.x, cursor.y, cursor.z)
    positions.setXYZ(1, node.x, node.y, node.z)
    positions.needsUpdate = true
    line.computeLineDistances()
  })

  return <primitive object={line} />
}
