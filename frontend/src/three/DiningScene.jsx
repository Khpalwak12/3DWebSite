import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Feast } from './food'
import { Materials, useMats } from './materials.jsx'
import { makeRugTexture } from './textures'

const maxDpr = Math.min(window.devicePixelRatio || 1, 1.25)

function Steam({ position }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    const group = ref.current
    if (!group) return
    const time = clock.elapsedTime
    group.children.forEach((mesh, index) => {
      const cycle = (time * 0.18 + index * 0.33) % 1
      mesh.position.y = cycle * 0.55
      mesh.material.opacity = Math.sin(cycle * Math.PI) * 0.16
    })
  })

  return (
    <group ref={ref} position={position}>
      {[0, 1].map((index) => (
        <mesh key={index} position={[(index - 0.5) * 0.06, 0.2, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#fff6ea" transparent opacity={0.08} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Spread() {
  const mats = useMats()
  const rug = useMemo(() => makeRugTexture(), [])
  const rugMat = useMemo(() => new THREE.MeshStandardMaterial({ map: rug, roughness: 0.96 }), [rug])

  useEffect(() => () => {
    rug.dispose()
    rugMat.dispose()
  }, [rug, rugMat])

  return (
    <group>
      <mesh material={mats.floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[5.2, 24]} />
      </mesh>
      <mesh material={mats.shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.1]}>
        <circleGeometry args={[2.35, 24]} />
      </mesh>
      <mesh material={rugMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.1]}>
        <circleGeometry args={[2.25, 24]} />
      </mesh>
      <mesh material={mats.wood} position={[0, 0.24, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.09, 24]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.29, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.018, 6, 24]} />
      </mesh>
      <Feast />
      <Steam position={[-0.15, 0.7, 0.05]} />
      <mesh material={mats.cushionRed} position={[-1.9, 0.1, 0.2]} scale={[1, 0.28, 1]}>
        <sphereGeometry args={[0.38, 12, 8]} />
      </mesh>
      <mesh material={mats.cushionNavy} position={[1.75, 0.1, -0.45]} scale={[1, 0.28, 1]}>
        <sphereGeometry args={[0.38, 12, 8]} />
      </mesh>
      <mesh material={mats.cushionGold} position={[0.35, 0.1, 1.9]} scale={[1, 0.28, 1]}>
        <sphereGeometry args={[0.38, 12, 8]} />
      </mesh>
      <mesh material={mats.cushionWine} position={[-0.45, 0.1, -1.95]} scale={[1, 0.28, 1]}>
        <sphereGeometry args={[0.38, 12, 8]} />
      </mesh>
      <group position={[0.1, 1.45, -0.1]}>
        <mesh material={mats.lantern}>
          <cylinderGeometry args={[0.16, 0.18, 0.28, 6]} />
        </mesh>
        <mesh material={mats.brass} position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.1, 0.16, 0.06, 6]} />
        </mesh>
        <mesh material={mats.brass} position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.06, 6]} />
        </mesh>
        <pointLight intensity={12} distance={4.5} decay={2} color="#ffb15e" />
      </group>
      <mesh material={mats.wall} position={[0, 1.5, -3.4]}>
        <planeGeometry args={[9, 4]} />
      </mesh>
      <mesh material={mats.frame} position={[1.7, 1.55, -3.36]}>
        <planeGeometry args={[1.78, 1.98]} />
      </mesh>
      <mesh material={mats.window} position={[1.7, 1.55, -3.34]}>
        <planeGeometry args={[1.46, 1.66]} />
      </mesh>
    </group>
  )
}

export default function DiningScene() {
  const holder = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const node = holder.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={holder} className="scene-holder">
      <Canvas
        camera={{ position: [2.2, 2.55, 3.35], fov: 33 }}
        dpr={maxDpr}
        frameloop={visible ? 'always' : 'never'}
        performance={{ min: 0.4 }}
        gl={{
          antialias: maxDpr <= 1,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.15
        }}
      >
        <color attach="background" args={['#140e0b']} />
        <fog attach="fog" args={['#140e0b', 7.5, 14]} />
        <ambientLight intensity={0.72} color="#ffe7cf" />
        <directionalLight position={[4.5, 6.5, 3]} intensity={2.2} color="#fff1df" />
        <group position={[-1.05, 0, 0]}>
          <Materials>
            <Spread />
          </Materials>
        </group>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping={false}
          autoRotate={visible}
          autoRotateSpeed={0.28}
          minPolarAngle={0.95}
          maxPolarAngle={1.18}
          minAzimuthAngle={-0.45}
          maxAzimuthAngle={0.35}
          target={[-1.05, 0.42, 0]}
        />
      </Canvas>
    </div>
  )
}
