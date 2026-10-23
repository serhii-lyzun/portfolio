import { useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import {
  AdditiveBlending,
  Vector3,
  type Group,
  type MeshPhysicalMaterial,
  type SpriteMaterial,
} from 'three'
import type { CaseStudy } from '@/content/types'
import { caseHref } from '@/hooks/useCaseRoute'
import { sceneCursor } from '@/lib/cursor'
import { scrollToCase, tour, useTour } from '@/lib/tour'
import { glowTexture } from './glowTexture'
import { orbitPosition } from './layout'
import { useLabelPortal } from './LabelPortal'
import { overPageUi } from './overPageUi'
import { pointerAtDepth, REACH, useScene } from './SceneContext'

/** Max share of the distance a node travels toward the cursor */
const PULL_STRENGTH = 0.35

/**
 * A floating crystal for one case (plan § 2.1): orbits the core, glows and is pulled toward the
 * cursor when near, shows its headline metric on focus. Click: behind the hero it scrolls to the
 * case in the tour; in the tour it opens the full case.
 */
export function CaseNode({ item }: { item: CaseStudy }) {
  const { live, pointer, focus, setHovered } = useScene()
  const portal = useLabelPortal()
  const group = useRef<Group>(null!)
  const crystal = useRef<Group>(null!)
  const material = useRef<MeshPhysicalMaterial>(null!)
  const halo = useRef<SpriteMaterial>(null!)

  const rest = useMemo(() => new Vector3(), [])
  const target = useMemo(() => new Vector3(), [])
  const pull = useMemo(() => new Vector3(), [])
  const cursor = useMemo(() => new Vector3(), [])
  const position = useMemo(() => {
    const v = new Vector3()
    live.set(item.slug, v)
    return v
  }, [live, item.slug])

  const isHovered = focus === item.slug
  const dimmed = focus !== null && !isHovered
  // The tour card on the left already names the active case; its floating label would only
  // collide with the orbiting screenshots
  const { mode, active } = useTour()
  const labelHidden = mode === 'cases' && active === item.slug
  const size = item.node.size * 0.55
  const { color } = item.node

  useFrame((state, delta) => {
    orbitPosition(item, state.clock.elapsedTime, rest)

    // Magnetic pull: move part of the way toward the cursor when it is close
    target.set(0, 0, 0)
    if (pointer.active && pointerAtDepth(pointer.ray, rest.z, cursor)) {
      const distance = Math.hypot(cursor.x - rest.x, cursor.y - rest.y)
      if (distance < REACH) {
        target
          .subVectors(cursor, rest)
          .setZ(0)
          .multiplyScalar((1 - distance / REACH) * PULL_STRENGTH)
      }
    }
    easing.damp3(pull, target, 0.25, delta)
    position.copy(rest).add(pull)
    group.current.position.copy(position)

    crystal.current.rotation.y += delta * (isHovered ? 1.2 : 0.35)
    crystal.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
    easing.damp3(crystal.current.scale, isHovered ? 1.25 : 1, 0.2, delta)
    easing.damp(
      material.current,
      'emissiveIntensity',
      isHovered ? 1.8 : dimmed ? 0.2 : 0.75,
      0.2,
      delta,
    )
    // Bloom provides most of the glow; the halo only hints at it
    easing.damp(halo.current, 'opacity', isHovered ? 0.4 : dimmed ? 0.04 : 0.12, 0.2, delta)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (overPageUi(e.nativeEvent)) return
    setHovered(item.slug)
    // Hero click scrolls to the tour card; in the tour it opens the case
    sceneCursor.set(tour.get().mode === 'cases' ? 'Open case' : 'Explore')
  }
  const out = () => {
    setHovered(null)
    sceneCursor.set(null)
  }

  return (
    <group ref={group}>
      <group ref={crystal}>
        <mesh castShadow={false}>
          <octahedronGeometry args={[size, 0]} />
          <meshPhysicalMaterial
            ref={material}
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            flatShading
          />
        </mesh>
      </group>

      <sprite scale={size * 4.5}>
        <spriteMaterial
          ref={halo}
          map={glowTexture()}
          color={color}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>

      {/* Generous invisible hit area: crystals are small and moving */}
      <mesh
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation()
          if (overPageUi(e.nativeEvent)) return
          // Behind the hero: fly to the case in the scroll tour. In the tour: open the full case.
          const { enabled, mode } = tour.get()
          if (enabled && mode === 'hero' && scrollToCase(item.slug)) return
          window.location.hash = caseHref(item.slug)
        }}
      >
        <sphereGeometry args={[size * 1.9, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html
        portal={portal}
        center
        position={[0, -size * 1.9 - 0.25, 0]}
        zIndexRange={[20, 0]}
        pointerEvents="none"
      >
        <div
          className="pointer-events-none w-max text-center transition-opacity duration-300 select-none"
          style={{ opacity: labelHidden ? 0 : dimmed ? (mode === 'cases' ? 0.15 : 0.35) : 1 }}
        >
          <p className="text-[13px] font-semibold text-ink [text-shadow:0_1px_8px_#070b14]">
            {item.nda && '🔒 '}
            {item.title}
          </p>
          <p
            className="text-xs font-medium transition-all duration-300"
            style={{
              color,
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? 0 : -4}px)`,
            }}
          >
            {item.headlineMetric} · Open case →
          </p>
        </div>
      </Html>
    </group>
  )
}
