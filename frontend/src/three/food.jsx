import { useMats } from './materials.jsx'

function Plate({ radius = 0.55 }) {
  const mats = useMats()
  return (
    <group>
      <mesh material={mats.plate} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[radius, radius * 0.92, 0.05, 20]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.058, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 0.9, 0.015, 6, 20]} />
      </mesh>
    </group>
  )
}

function BowlShell({ radius = 0.28, alt = false }) {
  const mats = useMats()
  return (
    <group>
      <mesh material={alt ? mats.bowlAlt : mats.bowl} position={[0, radius, 0]}>
        <sphereGeometry args={[radius, 16, 10, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52]} />
      </mesh>
      <mesh material={mats.gold} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[radius * 0.72, radius * 0.5, 0.06, 12]} />
      </mesh>
    </group>
  )
}

export function Qabili() {
  const mats = useMats()
  return (
    <group>
      <Plate radius={0.58} />
      <mesh material={mats.rice} position={[0, 0.13, 0]} scale={[1, 0.46, 1]}>
        <sphereGeometry args={[0.36, 16, 10]} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2
        return (
          <mesh key={index} material={index % 2 ? mats.carrot : mats.carrotAlt} position={[Math.cos(angle) * 0.16, 0.24, Math.sin(angle) * 0.14]} rotation={[0.5, angle, 0.7]}>
            <boxGeometry args={[0.13, 0.018, 0.04]} />
          </mesh>
        )
      })}
      {[[0.1, 0.26, 0.05], [-0.08, 0.25, -0.02], [0.02, 0.27, -0.09]].map((position, index) => (
        <mesh key={index} material={mats.raisin} position={position}>
          <sphereGeometry args={[0.028, 6, 6]} />
        </mesh>
      ))}
      <mesh material={mats.meat} position={[0.08, 0.2, 0.1]}>
        <sphereGeometry args={[0.08, 10, 8]} />
      </mesh>
    </group>
  )
}

function Skewer({ position, rotationY }) {
  const mats = useMats()
  return (
    <group position={position} rotation={[0.2, rotationY, 0.35]}>
      <mesh material={mats.stick} rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.7, 5]} />
      </mesh>
      {[-0.18, -0.02, 0.16].map((x, index) => (
        <mesh key={index} material={index % 2 ? mats.meatMid : mats.meatDark} position={[x, 0.1, 0]} scale={[1.15, 0.85, 0.85]}>
          <sphereGeometry args={[0.05, 8, 6]} />
        </mesh>
      ))}
    </group>
  )
}

export function KebabPlate() {
  return (
    <group>
      <Plate radius={0.5} />
      <Skewer position={[-0.06, 0, 0.06]} rotationY={0.2} />
      <Skewer position={[0.08, 0, -0.1]} rotationY={-0.2} />
    </group>
  )
}

export function Mantoo() {
  const mats = useMats()
  return (
    <group>
      <BowlShell radius={0.32} />
      {[[-0.06, 0.16, 0.02], [0.07, 0.15, 0.04], [0, 0.17, -0.07]].map((position, index) => (
        <mesh key={index} material={mats.dough} position={position} scale={[1, 0.72, 1]}>
          <sphereGeometry args={[0.055, 8, 6]} />
        </mesh>
      ))}
      <mesh material={mats.yogurt} position={[0, 0.2, 0.02]} scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.09, 10, 8]} />
      </mesh>
      <mesh material={mats.sauce} position={[-0.08, 0.18, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
      </mesh>
    </group>
  )
}

export function NaanStack() {
  const mats = useMats()
  return (
    <group>
      {[[0, 0.04, 0, 0], [0.08, 0.09, -0.02, 0.4]].map(([x, y, z, rotation], index) => (
        <mesh key={index} material={index === 1 ? mats.breadAlt : mats.bread} position={[x, y, z]} rotation={[-Math.PI / 2, 0, rotation]} scale={[1, 1.35, 1]}>
          <circleGeometry args={[0.28 - index * 0.02, 12]} />
        </mesh>
      ))}
    </group>
  )
}

export function TeaGlass() {
  const mats = useMats()
  return (
    <group>
      <mesh material={mats.brass} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 10]} />
      </mesh>
      <mesh material={mats.glass} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.075, 0.095, 0.26, 10]} />
      </mesh>
      <mesh material={mats.tea} position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.062, 0.082, 0.16, 10]} />
      </mesh>
    </group>
  )
}

export function Firni() {
  const mats = useMats()
  return (
    <group>
      <BowlShell radius={0.26} alt />
      <mesh material={mats.pudding} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 12]} />
      </mesh>
      {[[-0.04, 0.13, 0.03], [0.05, 0.13, -0.02]].map((position, index) => (
        <mesh key={index} material={mats.pistachio} position={position}>
          <sphereGeometry args={[0.015, 5, 5]} />
        </mesh>
      ))}
    </group>
  )
}

export function Dish({ kind }) {
  switch (kind) {
    case 'skewer':
      return <KebabPlate />
    case 'bowl':
      return <Mantoo />
    case 'bread':
      return <NaanStack />
    case 'drink':
      return <TeaGlass />
    case 'dessert':
      return <Firni />
    default:
      return <Qabili />
  }
}

export function Feast() {
  return (
    <group>
      <group position={[-0.28, 0.4, 0.05]} scale={0.7}>
        <Qabili />
      </group>
      <group position={[0.46, 0.4, -0.12]} scale={0.62}>
        <KebabPlate />
      </group>
      <group position={[-0.42, 0.4, -0.42]} scale={0.7}>
        <Mantoo />
      </group>
      <group position={[0.12, 0.4, 0.5]} scale={0.78}>
        <NaanStack />
      </group>
      <group position={[0.62, 0.4, 0.38]} scale={0.85}>
        <TeaGlass />
      </group>
      <group position={[0.05, 0.4, -0.5]} scale={0.62}>
        <Firni />
      </group>
    </group>
  )
}
