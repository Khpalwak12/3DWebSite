import { createContext, useContext, useEffect, useMemo } from 'react'
import * as THREE from 'three'

const MaterialsContext = createContext(null)

function make(list, color, extra = {}) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.62, ...extra })
  list.push(material)
  return material
}

export function createMaterials() {
  const list = []
  const materials = {
    plate: make(list, '#f6f1e7', { roughness: 0.35, metalness: 0.02 }),
    gold: make(list, '#d7b56a', { metalness: 0.65, roughness: 0.32 }),
    rice: make(list, '#e4b14c', { roughness: 0.9 }),
    carrot: make(list, '#e07a2f', { roughness: 0.55 }),
    carrotAlt: make(list, '#c85a20', { roughness: 0.55 }),
    raisin: make(list, '#2c1810', { roughness: 0.45 }),
    meat: make(list, '#7a3b2e', { roughness: 0.52 }),
    meatDark: make(list, '#5a2d24', { roughness: 0.46 }),
    meatMid: make(list, '#8d4332', { roughness: 0.46 }),
    dough: make(list, '#f7f3ea', { roughness: 0.62 }),
    yogurt: make(list, '#f4f7f2', { roughness: 0.4 }),
    sauce: make(list, '#c4512a', { roughness: 0.5 }),
    bread: make(list, '#c9843a', { roughness: 0.78, side: THREE.DoubleSide }),
    breadAlt: make(list, '#e2b15e', { roughness: 0.78, side: THREE.DoubleSide }),
    brass: make(list, '#b08d57', { metalness: 0.7, roughness: 0.28 }),
    tea: make(list, '#c47a32', { roughness: 0.3, transparent: true, opacity: 0.9 }),
    glass: make(list, '#fffaf4', { transparent: true, opacity: 0.28, roughness: 0.12, metalness: 0.04 }),
    bowl: make(list, '#f3eee4', { roughness: 0.4, side: THREE.DoubleSide }),
    bowlAlt: make(list, '#f7f3ea', { roughness: 0.4, side: THREE.DoubleSide }),
    pudding: make(list, '#f3e3c4', { roughness: 0.35 }),
    pistachio: make(list, '#2f6a3c', { roughness: 0.5 }),
    wood: make(list, '#6b4126', { roughness: 0.7 }),
    woodDark: make(list, '#4a2c1a', { roughness: 0.75 }),
    floor: make(list, '#24160f', { roughness: 1 }),
    wall: make(list, '#1a100c', { roughness: 1 }),
    frame: make(list, '#d7b56a', { metalness: 0.3, roughness: 0.45 }),
    stick: make(list, '#d9c7ae', { metalness: 0.2, roughness: 0.45 }),
    cushionRed: make(list, '#8d2e2a', { roughness: 0.86 }),
    cushionNavy: make(list, '#1d3a56', { roughness: 0.86 }),
    cushionGold: make(list, '#c4a265', { roughness: 0.86 }),
    cushionWine: make(list, '#6e2430', { roughness: 0.86 }),
    lantern: make(list, '#ffb15a', { emissive: '#ff8a2a', emissiveIntensity: 1.1, roughness: 0.4 }),
    window: new THREE.MeshBasicMaterial({ color: '#ffc58a' }),
    shadow: new THREE.MeshBasicMaterial({ color: '#070402', transparent: true, opacity: 0.4, depthWrite: false }),
  }
  list.push(materials.window, materials.shadow)
  materials.dispose = () => list.forEach((material) => material.dispose())
  return materials
}

export function Materials({ children }) {
  const materials = useMemo(() => createMaterials(), [])

  useEffect(() => () => materials.dispose(), [materials])

  return <MaterialsContext.Provider value={materials}>{children}</MaterialsContext.Provider>
}

export function useMats() {
  return useContext(MaterialsContext)
}
