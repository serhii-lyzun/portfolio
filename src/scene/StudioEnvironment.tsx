import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import {
  BackSide,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
} from 'three'

/** Light panels reflected by the crystals: cyan strip above, coral side, soft white key. */
const PANELS: {
  color: string
  intensity: number
  position: [number, number, number]
  scale: [number, number]
}[] = [
  { color: '#3fe0e8', intensity: 2, position: [0, 4, -6], scale: [10, 2] },
  { color: '#ff5a4e', intensity: 1.5, position: [-6, -2, 2], scale: [4, 6] },
  { color: '#e8ecf4', intensity: 1, position: [6, 2, 4], scale: [3, 3] },
]

/**
 * Studio-style reflections generated once on the GPU (PMREM of a tiny scene of light panels).
 * Same look as drei's <Environment>+<Lightformer>, without bundling its HDR/EXR/gain-map loaders.
 */
export function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const studio = new Scene()
    // Dark room so only the panels light the reflections
    studio.add(
      new Mesh(
        new SphereGeometry(20, 16, 8),
        new MeshBasicMaterial({ color: '#05070d', side: BackSide }),
      ),
    )
    for (const p of PANELS) {
      const panel = new Mesh(
        new PlaneGeometry(...p.scale),
        new MeshBasicMaterial({
          color: new Color(p.color).multiplyScalar(p.intensity),
          side: DoubleSide,
        }),
      )
      panel.position.set(...p.position)
      panel.lookAt(0, 0, 0) // front face toward the crystals
      studio.add(panel)
    }

    const pmrem = new PMREMGenerator(gl)
    const target = pmrem.fromScene(studio, 0.04)
    scene.environment = target.texture

    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      studio.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose()
          ;(o.material as MeshBasicMaterial).dispose()
        }
      })
    }
  }, [gl, scene])

  return null
}
