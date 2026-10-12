import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { makeWoodTexture } from './textures'

const maxDpr = Math.min(window.devicePixelRatio || 1, 1.25)

function InvalidateOnChange({ tables, selectedId }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    invalidate()
  }, [tables, selectedId, invalidate])
  return null
}

function Chair({ position, rotation }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.32, 0.07, 0.32]} />
        <meshStandardMaterial color="#3d2618" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.48, -0.13]}>
        <boxGeometry args={[0.32, 0.36, 0.06]} />
        <meshStandardMaterial color="#4c3020" roughness={0.8} />
      </mesh>
    </group>
  )
}

function TableMesh({ table, selected, onSelect }) {
  const color = selected ? '#f0d48a' : table.available ? '#d7b56a' : table.reason === 'taken' ? '#6d3430' : '#4e453c'
  const chairs = table.shape === 'rect'
    ? [
        [-0.42, 0.62, 0],
        [0.5, 0.62, 0],
        [-0.42, -0.62, Math.PI],
        [0.5, -0.62, Math.PI],
      ]
    : Array.from({ length: Math.min(table.seats, 4) }, (_, index) => {
        const count = Math.min(table.seats, 4)
        const angle = (index / count) * Math.PI * 2
        const x = Math.cos(angle) * 0.92
        const z = Math.sin(angle) * 0.92
        return [x, z, Math.atan2(-x, -z)]
      })

  return (
    <group
      position={[table.x, 0, table.z]}
      onClick={(event) => {
        event.stopPropagation()
        if (table.available) onSelect(table.id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = table.available ? 'pointer' : 'not-allowed'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
    >
      {table.shape === 'rect' ? (
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[1.55, 0.08, 0.78]} />
          <meshStandardMaterial color={color} roughness={0.5} emissive={selected ? '#8a6420' : '#000'} emissiveIntensity={selected ? 0.35 : 0} />
        </mesh>
      ) : (
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.08, 16]} />
          <meshStandardMaterial color={color} roughness={0.5} emissive={selected ? '#8a6420' : '#000'} emissiveIntensity={selected ? 0.35 : 0} />
        </mesh>
      )}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.46, 8]} />
        <meshStandardMaterial color="#3a2418" roughness={0.8} />
      </mesh>
      {chairs.map(([x, z, rotation], index) => (
        <Chair key={index} position={[x, 0, z]} rotation={rotation} />
      ))}
      <Html center position={[0, 0.85, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className={`table-tag ${selected ? 'is-on' : ''} ${table.available ? '' : 'is-off'}`}>
          <strong>{table.label}</strong>
          <span>{table.seats} کسان</span>
        </div>
      </Html>
    </group>
  )
}

function Room() {
  const wood = useMemo(() => makeWoodTexture(), [])
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ map: wood, roughness: 0.9 }), [wood])

  useEffect(() => () => {
    wood.dispose()
    woodMat.dispose()
  }, [wood, woodMat])

  return (
    <group>
      <mesh material={woodMat} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]}>
        <planeGeometry args={[11, 9]} />
      </mesh>
      <mesh position={[0, 1.25, -3.9]}>
        <planeGeometry args={[11, 2.6]} />
        <meshBasicMaterial color="#2a1c16" />
      </mesh>
      <mesh position={[-5.4, 1.25, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 2.6]} />
        <meshBasicMaterial color="#241812" />
      </mesh>
      <mesh position={[5.4, 1.25, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[9, 2.6]} />
        <meshBasicMaterial color="#241812" />
      </mesh>
      <mesh position={[0, 1.35, -3.85]}>
        <planeGeometry args={[2.8, 1.25]} />
        <meshBasicMaterial color="#ffc58a" />
      </mesh>
    </group>
  )
}

export default function TableMap({ tables, selectedId, onSelect }) {
  return (
    <Canvas
      camera={{ position: [0.2, 7.4, 8.2], fov: 38 }}
      dpr={maxDpr}
      frameloop="demand"
      gl={{
        antialias: maxDpr <= 1,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12
      }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#17110e']} />
      <ambientLight intensity={0.85} color="#fff0e2" />
      <directionalLight position={[4, 8, 5]} intensity={1.8} color="#fff3e4" />
      <InvalidateOnChange tables={tables} selectedId={selectedId} />
      <Room />
      {tables.map((table) => (
        <TableMesh key={table.id} table={table} selected={table.id === selectedId} onSelect={onSelect} />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping={false}
        minPolarAngle={0.55}
        maxPolarAngle={1.15}
        target={[0.1, 0.2, 0.4]}
      />
    </Canvas>
  )
}
