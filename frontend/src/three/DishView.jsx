import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Dish } from './food'
import { Materials } from './materials.jsx'

const maxDpr = Math.min(window.devicePixelRatio || 1, 1.15)

export default function DishView({ kind }) {
  return (
    <Canvas
      camera={{ position: [1.7, 1.25, 1.85], fov: 35 }}
      dpr={maxDpr}
      frameloop="always"
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <color attach="background" args={['#1a110d']} />
      <ambientLight intensity={0.85} color="#fff0e0" />
      <directionalLight position={[2.5, 3.5, 2]} intensity={2} color="#fff4e4" />
      <Materials>
        <group position={[0, -0.15, 0]}>
          <Dish kind={kind} />
        </group>
      </Materials>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
        <circleGeometry args={[1.1, 16]} />
        <meshBasicMaterial color="#2a1b14" />
      </mesh>
      <OrbitControls enablePan={false} enableZoom={false} enableDamping={false} autoRotate autoRotateSpeed={0.8} target={[0, 0.15, 0]} />
    </Canvas>
  )
}
