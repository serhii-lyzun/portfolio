import { useEffect, useMemo, useRef, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { SRGBColorSpace, Vector3, type Group, type MeshBasicMaterial, type Texture } from 'three'
import type { CaseStudy, ScreenshotMedia } from '@/content/types'
import { lightbox } from '@/lib/lightbox'
import { overPageUi } from './overPageUi'
import { useScene } from './SceneContext'

/** Width of a screenshot card in scene units (height follows the image) */
const CARD_WIDTH = 2.5

/**
 * The focused case's screenshots float out of its crystal as glass cards and orbit it slowly
 * (plan § 3). Hover brings a card forward; click opens the fullscreen lightbox.
 */
export function ScreenshotOrbit({ item }: { item: CaseStudy }) {
  const shots = useMemo(
    () => item.media.filter((m): m is ScreenshotMedia => m.kind === 'screenshot'),
    [item],
  )
  const textures = useTexture(shots.map((s) => s.picture.img.src))
  useEffect(() => {
    for (const t of textures) {
      t.colorSpace = SRGBColorSpace
      t.needsUpdate = true
    }
  }, [textures])

  return (
    <>
      {shots.map((shot, i) => (
        <OrbitCard
          key={shot.picture.img.src}
          item={item}
          shots={shots}
          index={i}
          texture={textures[i]}
        />
      ))}
    </>
  )
}

type CardProps = {
  item: CaseStudy
  shots: ScreenshotMedia[]
  index: number
  texture: Texture
}

function OrbitCard({ item, shots, index, texture }: CardProps) {
  const { live } = useScene()
  const group = useRef<Group>(null!)
  const image = useRef<MeshBasicMaterial>(null!)
  const frame = useRef<MeshBasicMaterial>(null!)
  const [hovered, setHovered] = useState(false)
  const target = useMemo(() => new Vector3(), [])
  // Own orbit angle, evenly spaced; it stops while the card is hovered so it is easy to click
  const angle = useRef((index / shots.length) * Math.PI * 2 + 0.6)
  const shot = shots[index]
  const height = (CARD_WIDTH * shot.picture.img.h) / shot.picture.img.w

  useFrame((_, delta) => {
    const node = live.get(item.slug)
    if (!node) return
    // One slow orbit around the crystal, leaning out toward the viewer
    if (!hovered) angle.current += delta * 0.06
    const a = angle.current
    target.set(
      node.x + Math.cos(a) * 2.0,
      node.y + Math.sin(a) * 1.4,
      node.z + 0.7 + Math.sin(a) * 0.35 + (hovered ? 0.6 : 0),
    )
    easing.damp3(group.current.position, target, 0.45, delta)
    group.current.rotation.y = -Math.cos(a) * 0.28
    easing.damp3(group.current.scale, hovered ? 1.12 : 1, 0.2, delta)
    // Fade in on mount
    easing.damp(image.current, 'opacity', 1, 0.4, delta)
    easing.damp(frame.current, 'opacity', hovered ? 1 : 0.9, 0.4, delta)
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (overPageUi(e.nativeEvent)) return
    setHovered(true)
    document.body.style.cursor = 'zoom-in'
  }
  const out = () => {
    setHovered(false)
    document.body.style.cursor = ''
  }

  return (
    <group
      ref={group}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation()
        if (overPageUi(e.nativeEvent)) return
        lightbox.open(shots, index, item.title)
      }}
    >
      {/* Cards are foreground UI: drawn last and never hidden behind other crystals' glow */}
      {/* Frame: a slightly larger panel in the case colour behind the image */}
      <mesh position={[0, 0, -0.02]} renderOrder={10}>
        <planeGeometry args={[CARD_WIDTH + 0.12, height + 0.12]} />
        <meshBasicMaterial
          ref={frame}
          color={hovered ? item.node.color : '#1e2840'}
          transparent
          opacity={0}
          fog={false}
          depthTest={false}
        />
      </mesh>
      <mesh renderOrder={11}>
        <planeGeometry args={[CARD_WIDTH, height]} />
        <meshBasicMaterial
          ref={image}
          map={texture}
          toneMapped={false}
          transparent
          opacity={0}
          fog={false}
          depthTest={false}
        />
      </mesh>
    </group>
  )
}
