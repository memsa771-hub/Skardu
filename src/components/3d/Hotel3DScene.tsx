import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  CameraControls,
  Environment,
  Text,
  Box,
  RoundedBox,
} from '@react-three/drei'
import * as THREE from 'three'
import { ROOMS } from '../../data/hotel'

export type TourZone = 'ground' | 'first' | string

interface HotelSceneProps {
  zone: TourZone
  floor: 'ground' | 'first'
  onEnterRoom: (roomId: string) => void
  onExitRoom: () => void
  onFloorChange: (floor: 'ground' | 'first') => void
}

const CAMERA_PRESETS: Record<string, { pos: THREE.Vector3Tuple; target: THREE.Vector3Tuple }> = {
  ground: { pos: [0, 2.8, 13], target: [0, 1.5, -2] },
  first:  { pos: [0, 7.8, 13], target: [0, 6.2, -2] },
  'gf-master':           { pos: [5.5, 2.5, 3.5], target: [0, 1.3, -1] },
  'gf-master-1-single':  { pos: [5.5, 2.5, 3.5], target: [0, 1.3, -1] },
  'gf-master-master':    { pos: [6.0, 2.8, 4.0], target: [0, 1.3,  0] },
  'gf-master-2-single':  { pos: [6.0, 2.8, 4.0], target: [0, 1.3,  0] },
  'gf-3-single':         { pos: [6.0, 2.5, 3.5], target: [0, 1.3, -1] },
  'gf-2-single':         { pos: [5.5, 2.5, 3.5], target: [0, 1.3, -1] },
  'ff-master-1-single':  { pos: [5.5, 7.5, 3.5], target: [0, 6.3, -1] },
  'ff-master-master':    { pos: [6.0, 7.8, 4.0], target: [0, 6.3,  0] },
  'ff-single-single-master': { pos: [6.0, 7.8, 4.0], target: [0, 6.3, 0] },
  'ff-single-single':    { pos: [5.5, 7.5, 3.5], target: [0, 6.3, -1] },
  'ff-master':           { pos: [5.5, 7.5, 3.5], target: [0, 6.3, -1] },
}

const M = {
  wall:        { color: '#f5f1ec', roughness: 0.95 },
  wallAccent:  { color: '#ede7de', roughness: 0.9 },
  ceiling:     { color: '#faf8f5', roughness: 1 },
  marble:      { color: '#ece8e3', roughness: 0.25, metalness: 0.08 },
  marbleDark:  { color: '#d4cfc8', roughness: 0.3 },
  wood:        { color: '#7a6355', roughness: 0.82, metalness: 0.05 },
  woodDark:    { color: '#4a3f38', roughness: 0.9 },
  fabric:      { color: '#f5f0ea', roughness: 1 },
  fabricDark:  { color: '#c8bfb0', roughness: 0.95 },
  metal:       { color: '#b8a99a', roughness: 0.4, metalness: 0.6 },
  metalGold:   { color: '#c9a96e', roughness: 0.35, metalness: 0.7 },
  glass:       { color: '#a8c4d8', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 },
  glassBalc:   { color: '#b8d4e4', roughness: 0.03, metalness: 0.05, transparent: true, opacity: 0.28 },
  mountain:    { color: '#5c6b7a', roughness: 0.95 },
  mountainSnow:{ color: '#e8edf2', roughness: 0.8 },
  sky:         { color: '#9bc4e2' },
  reception:   { color: '#3a3530', roughness: 0.7 },
  plant:       { color: '#4a7c59', roughness: 1 },
  plantPot:    { color: '#8b7355', roughness: 0.85 },
  carpetRich:  { color: '#6b4c3b', roughness: 1 },
  tvScreen:    { color: '#111111', roughness: 0.2, metalness: 0.3 },
  frame:       { color: '#c9a96e', roughness: 0.4, metalness: 0.5 },
}

function MountainBackdrop({ y = 0 }: { y?: number }) {
  const peaks: [number, number, number, number][] = [
    [-9, -14, 4, 6], [-5, -16, 5, 8], [0, -18, 6.5, 10],
    [5, -15, 4.5, 7], [9, -13, 3.5, 5.5], [-13, -12, 3, 4.5], [13, -11, 2.5, 4],
  ]
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 5, -22]}>
        <planeGeometry args={[55, 18]} />
        <meshBasicMaterial color="#9bc4e2" />
      </mesh>
      <mesh position={[0, 1.5, -22]}>
        <planeGeometry args={[55, 6]} />
        <meshBasicMaterial color="#b8d8b0" />
      </mesh>
      {peaks.map(([x, z, r, h], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, h * 0.4, 0]}>
            <coneGeometry args={[r, h, 5]} />
            <meshStandardMaterial {...M.mountain} />
          </mesh>
          <mesh position={[0, h * 0.72, 0]}>
            <coneGeometry args={[r * 0.42, h * 0.38, 5]} />
            <meshStandardMaterial {...M.mountainSnow} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Window3D({ pos, w = 2.2, h = 1.8, yOff = 1.2, mountainY = 0 }: {
  pos: THREE.Vector3Tuple; w?: number; h?: number; yOff?: number; mountainY?: number
}) {
  return (
    <group position={pos}>
      <Box args={[w + 0.22, h + 0.22, 0.1]} position={[0, yOff, 0]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <mesh position={[0, yOff, 0.06]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial {...M.glass} />
      </mesh>
      <MountainBackdrop y={mountainY} />
      <pointLight position={[0, yOff, 0.3]} intensity={0.5} color="#fff5e0" distance={5} />
    </group>
  )
}

function FloorMarble({ size = 14, tile = 1.3, y = 0 }: { size?: number; tile?: number; y?: number }) {
  const tiles: JSX.Element[] = []
  const half = size / 2
  for (let x = -half; x < half; x += tile) {
    for (let z = -half; z < half; z += tile) {
      const isAlt = (Math.floor(x / tile) + Math.floor(z / tile)) % 2 === 0
      tiles.push(
        <mesh key={`${x}-${z}`} position={[x + tile / 2, y, z + tile / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[tile - 0.025, tile - 0.025]} />
          <meshStandardMaterial color={isAlt ? M.marble.color : M.marbleDark.color} roughness={0.28} metalness={0.06} />
        </mesh>
      )
    }
  }
  return <group>{tiles}</group>
}

function WoodFloor({ size = 10, y = 0 }: { size?: number; y?: number }) {
  const planks: JSX.Element[] = []
  const pw = 0.32
  for (let z = -size / 2; z < size / 2; z += pw) {
    planks.push(
      <mesh key={z} position={[0, y, z + pw / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, pw - 0.018]} />
        <meshStandardMaterial color={z % 0.64 < 0.32 ? '#6d5a4d' : '#7a6355'} roughness={0.85} />
      </mesh>
    )
  }
  return <group>{planks}</group>
}

function CeilingLight({ pos, size = [0.5, 0.04, 1.2] as [number, number, number] }: {
  pos: THREE.Vector3Tuple; size?: [number, number, number]
}) {
  return (
    <group position={pos}>
      <spotLight angle={0.5} penumbra={0.85} intensity={10} color="#fff8f0" castShadow shadow-mapSize={[512, 512]} />
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#faf8f5" emissive="#fff8f0" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function WallSconce({ pos }: { pos: THREE.Vector3Tuple }) {
  return (
    <group position={pos}>
      <pointLight intensity={0.7} color="#ffeacc" distance={3.5} />
      <mesh>
        <boxGeometry args={[0.07, 0.22, 0.1]} />
        <meshStandardMaterial {...M.metalGold} emissive="#c9a96e" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.1, 0.18, 8]} />
        <meshStandardMaterial color="#fdf0d0" transparent opacity={0.9} emissive="#fff5cc" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Door3D({ pos, rot = [0, 0, 0] as THREE.Vector3Tuple, label, color, subLabel, onClick }: {
  pos: THREE.Vector3Tuple; rot?: THREE.Vector3Tuple; label: string; color: string; subLabel?: string; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <group position={pos} rotation={rot}>
      <Box args={[2.4, 3.1, 0.18]} position={[0, 1.55, 0]}>
        <meshStandardMaterial color="#3a3530" roughness={0.75} />
      </Box>
      <mesh
        position={[0, 1.4, 0.1]}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <boxGeometry args={[2.0, 2.7, 0.1]} />
        <meshStandardMaterial color={hovered ? '#8a7358' : color} roughness={0.6} emissive={hovered ? '#c4a882' : '#000000'} emissiveIntensity={hovered ? 0.3 : 0} />
      </mesh>
      <Box args={[1.6, 0.95, 0.06]} position={[0, 2.0, 0.14]}>
        <meshStandardMaterial color={hovered ? '#9a8368' : '#5a4a3a'} roughness={0.7} />
      </Box>
      <Box args={[1.6, 0.95, 0.06]} position={[0, 0.85, 0.14]}>
        <meshStandardMaterial color={hovered ? '#9a8368' : '#5a4a3a'} roughness={0.7} />
      </Box>
      <RoundedBox args={[0.14, 0.35, 0.07]} radius={0.03} position={[0.62, 1.3, 0.17]}>
        <meshStandardMaterial {...M.metalGold} />
      </RoundedBox>
      <Box args={[1.85, 0.32, 0.04]} position={[0, 2.82, 0.12]}>
        <meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.6} />
      </Box>
      <Text position={[0, 2.82, 0.16]} fontSize={0.1} color="#1a1a1a" anchorX="center" maxWidth={1.7}>
        {label}
      </Text>
      {subLabel && (
        <Text position={[0, 2.58, 0.16]} fontSize={0.075} color="#6b5a4a" anchorX="center" maxWidth={1.7}>
          {subLabel}
        </Text>
      )}
      {hovered && (
        <Text position={[0, 0.35, 0.2]} fontSize={0.11} color="#c9a96e" anchorX="center">
          Enter
        </Text>
      )}
    </group>
  )
}

function Bed({ pos = [0, 0, 0] as THREE.Vector3Tuple, scale = 1, fabricColor = '#f5f0ea' }) {
  return (
    <group position={pos} scale={scale}>
      <Box args={[2.3, 0.28, 2.9]} position={[0, 0.14, 0]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <Box args={[2.1, 0.22, 2.7]} position={[0, 0.39, 0]}>
        <meshStandardMaterial color="#f8f4ef" roughness={0.95} />
      </Box>
      <Box args={[2.08, 0.14, 2.1]} position={[0, 0.54, 0.25]}>
        <meshStandardMaterial color={fabricColor} roughness={0.95} />
      </Box>
      <Box args={[2.2, 0.85, 0.2]} position={[0, 0.85, -1.32]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <Box args={[1.95, 0.68, 0.08]} position={[0, 0.82, -1.22]}>
        <meshStandardMaterial color={fabricColor} roughness={0.9} />
      </Box>
      <Box args={[0.62, 0.15, 0.45]} position={[-0.68, 0.57, -0.85]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#fdf8f2" roughness={0.9} />
      </Box>
      <Box args={[0.62, 0.15, 0.45]} position={[0.68, 0.57, -0.85]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#fdf8f2" roughness={0.9} />
      </Box>
      <Box args={[0.55, 0.6, 0.52]} position={[-1.45, 0.3, -0.3]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <Box args={[0.55, 0.6, 0.52]} position={[1.45, 0.3, -0.3]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <group position={[-1.45, 0.72, -0.3]}>
        <pointLight intensity={0.6} color="#ffeacc" distance={2.5} />
        <mesh><cylinderGeometry args={[0.06, 0.1, 0.4, 10]} /><meshStandardMaterial {...M.metalGold} /></mesh>
        <mesh position={[0, 0.28, 0]}><coneGeometry args={[0.16, 0.28, 12]} /><meshStandardMaterial color="#fdf0d0" transparent opacity={0.88} emissive="#ffeacc" emissiveIntensity={0.35} /></mesh>
      </group>
      <group position={[1.45, 0.72, -0.3]}>
        <pointLight intensity={0.6} color="#ffeacc" distance={2.5} />
        <mesh><cylinderGeometry args={[0.06, 0.1, 0.4, 10]} /><meshStandardMaterial {...M.metalGold} /></mesh>
        <mesh position={[0, 0.28, 0]}><coneGeometry args={[0.16, 0.28, 12]} /><meshStandardMaterial color="#fdf0d0" transparent opacity={0.88} emissive="#ffeacc" emissiveIntensity={0.35} /></mesh>
      </group>
    </group>
  )
}

function SingleBed({ pos = [0, 0, 0] as THREE.Vector3Tuple, fabricColor = '#e8e0d4' }) {
  return (
    <group position={pos}>
      <Box args={[1.1, 0.22, 2.1]} position={[0, 0.11, 0]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <Box args={[1.0, 0.18, 1.95]} position={[0, 0.29, 0]}>
        <meshStandardMaterial color="#f5f0ea" roughness={0.95} />
      </Box>
      <Box args={[0.98, 0.1, 1.4]} position={[0, 0.4, 0.25]}>
        <meshStandardMaterial color={fabricColor} roughness={0.95} />
      </Box>
      <Box args={[1.05, 0.62, 0.14]} position={[0, 0.6, -0.97]}>
        <meshStandardMaterial {...M.woodDark} />
      </Box>
      <Box args={[0.55, 0.12, 0.38]} position={[0, 0.45, -0.72]} rotation={[0.2, 0, 0]}>
        <meshStandardMaterial color="#fdf8f2" roughness={0.9} />
      </Box>
    </group>
  )
}

function ArmChair({ pos = [0, 0, 0] as THREE.Vector3Tuple, color = '#c8bfb0' }) {
  return (
    <group position={pos}>
      <Box args={[1.0, 0.45, 0.9]} position={[0, 0.22, 0]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box args={[1.0, 0.55, 0.18]} position={[0, 0.5, -0.36]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box args={[0.15, 0.38, 0.72]} position={[-0.42, 0.36, 0]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
      <Box args={[0.15, 0.38, 0.72]} position={[0.42, 0.36, 0]}><meshStandardMaterial color={color} roughness={0.9} /></Box>
    </group>
  )
}

function TVUnit({ pos = [0, 0, 0] as THREE.Vector3Tuple, w = 2.8 }) {
  return (
    <group position={pos}>
      <Box args={[w, 0.55, 0.45]} position={[0, 0.27, 0]}><meshStandardMaterial {...M.woodDark} /></Box>
      <Box args={[w * 0.7, 0.85, 0.08]} position={[0, 1.0, 0.22]}><meshStandardMaterial {...M.tvScreen} /></Box>
    </group>
  )
}

function Painting({ pos = [0, 0, 0] as THREE.Vector3Tuple, w = 1.2, h = 0.9, color = '#2c4a6b' }) {
  return (
    <group position={pos}>
      <Box args={[w + 0.12, h + 0.12, 0.06]}><meshStandardMaterial {...M.frame} /></Box>
      <Box args={[w, h, 0.04]} position={[0, 0, 0.04]}><meshStandardMaterial color={color} roughness={1} /></Box>
    </group>
  )
}

function Plant({ pos = [0, 0, 0] as THREE.Vector3Tuple, h = 0.8 }) {
  return (
    <group position={pos}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.14, 0.18, 0.4, 10]} /><meshStandardMaterial {...M.plantPot} /></mesh>
      <mesh position={[0, 0.45 + h * 0.5, 0]}><sphereGeometry args={[h * 0.35, 7, 7]} /><meshStandardMaterial {...M.plant} /></mesh>
    </group>
  )
}

function Rug({ pos = [0, 0.01, 0] as THREE.Vector3Tuple, w = 3.5, d = 2.5, color = '#8b6f5c' }) {
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}

function Desk({ pos = [0, 0, 0] as THREE.Vector3Tuple }) {
  return (
    <group position={pos}>
      <Box args={[1.4, 0.08, 0.7]} position={[0, 0.76, 0]}><meshStandardMaterial {...M.wood} /></Box>
      {[[-0.6, -0.28], [0.6, -0.28], [-0.6, 0.28], [0.6, 0.28]].map(([x, z], i) => (
        <Box key={i} args={[0.06, 0.76, 0.06]} position={[x, 0.38, z]}><meshStandardMaterial {...M.woodDark} /></Box>
      ))}
    </group>
  )
}

function Staircase({ pos = [0, 0, 0] as THREE.Vector3Tuple, onClick }: {
  pos?: THREE.Vector3Tuple; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const steps = 10
  return (
    <group position={pos}>
      {Array.from({ length: steps }, (_, i) => (
        <Box key={i} args={[2.4, 0.18, 0.42]} position={[0, i * 0.43 + 0.09, -i * 0.42]}>
          <meshStandardMaterial color={i % 2 === 0 ? M.marble.color : M.marbleDark.color} roughness={0.3} metalness={0.05} />
        </Box>
      ))}
      {[-1.1, 1.1].map((x) => (
        <group key={x}>
          {Array.from({ length: steps }, (_, i) => (
            <Box key={i} args={[0.05, 0.55, 0.05]} position={[x, i * 0.43 + 0.27, -i * 0.42]}>
              <meshStandardMaterial {...M.metalGold} />
            </Box>
          ))}
          <Box args={[0.06, 0.06, steps * 0.44]} position={[x, steps * 0.43 * 0.5 + 0.55, -(steps - 1) * 0.42 / 2]}>
            <meshStandardMaterial {...M.metalGold} />
          </Box>
        </group>
      ))}
      <mesh
        position={[0, steps * 0.43 + 0.8, -(steps - 1) * 0.42]}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <boxGeometry args={[2.0, 0.5, 0.06]} />
        <meshStandardMaterial color={hovered ? '#d4b57e' : '#c9a96e'} roughness={0.3} metalness={0.5} />
      </mesh>
      <Text position={[0, steps * 0.43 + 0.8, -(steps - 1) * 0.42 + 0.05]} fontSize={0.13} color="#1a1a1a" anchorX="center">
        {hovered ? 'Go to First Floor' : 'First Floor  \u2191'}
      </Text>
    </group>
  )
}

function Lobby({ y = 0 }: { y?: number }) {
  return (
    <group position={[0, y, 0]}>
      <Box args={[4.5, 1.15, 1.1]} position={[0, 0.575, 10.5]}><meshStandardMaterial {...M.reception} /></Box>
      <Box args={[4.7, 0.12, 1.3]} position={[0, 1.21, 10.5]}><meshStandardMaterial color="#e8e2d8" roughness={0.25} metalness={0.08} /></Box>
      <Text position={[0, 2.7, 14.2]} fontSize={0.5} color="#c9a96e" anchorX="center" letterSpacing={0.2}>NESTOPIA</Text>
      <Text position={[0, 2.15, 14.2]} fontSize={0.14} color="#8a8078" anchorX="center" letterSpacing={0.25}>HOTELS  &amp;  RESORTS</Text>
      <Box args={[5.0, 0.02, 0.02]} position={[0, 2.3, 14.18]}><meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.5} /></Box>
      <Plant pos={[-2.8, y, 12.5]} h={0.9} />
      <Plant pos={[2.8, y, 12.5]} h={0.9} />
      <Box args={[3.5, 0.55, 1.2]} position={[-3.5, 0.27, 8]}><meshStandardMaterial color="#8a7870" roughness={0.9} /></Box>
      <Box args={[3.5, 0.62, 0.22]} position={[-3.5, 0.58, 7.45]}><meshStandardMaterial color="#8a7870" roughness={0.9} /></Box>
      <Box args={[3.5, 0.55, 1.2]} position={[3.5, 0.27, 8]}><meshStandardMaterial color="#8a7870" roughness={0.9} /></Box>
      <Box args={[3.5, 0.62, 0.22]} position={[3.5, 0.58, 7.45]}><meshStandardMaterial color="#8a7870" roughness={0.9} /></Box>
      <Box args={[1.4, 0.08, 0.8]} position={[0, 0.44, 7.8]}><meshStandardMaterial color="#e8e2d8" roughness={0.25} metalness={0.08} /></Box>
      <CeilingLight pos={[0, 3.85, 11]} size={[1.2, 0.04, 0.25]} />
      <CeilingLight pos={[-2.5, 3.85, 8]} />
      <CeilingLight pos={[2.5, 3.85, 8]} />
    </group>
  )
}

function GroundFloor({ onEnterRoom, onGoFirstFloor }: { onEnterRoom: (id: string) => void; onGoFirstFloor: () => void }) {
  const groundRooms = ROOMS.filter((r) => r.floor === 'ground')
  return (
    <group>
      <FloorMarble size={16} tile={1.3} y={0} />
      <Box args={[8, 0.15, 30]} position={[0, 4.0, 0]}><meshStandardMaterial {...M.ceiling} /></Box>
      <Box args={[0.12, 4.0, 30]} position={[-4.0, 2.0, 0]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.12, 4.0, 30]} position={[4.0, 2.0, 0]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.05, 1.1, 30]} position={[-3.93, 0.55, 0]}><meshStandardMaterial {...M.wallAccent} /></Box>
      <Box args={[0.05, 1.1, 30]} position={[3.93, 0.55, 0]}><meshStandardMaterial {...M.wallAccent} /></Box>
      <Box args={[8, 4.0, 0.12]} position={[0, 2.0, -9.5]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[8, 4.0, 0.12]} position={[0, 2.0, 14.5]}><meshStandardMaterial {...M.wall} /></Box>
      {[-7, -3, 1, 5].map((z) => <CeilingLight key={z} pos={[0, 3.85, z]} />)}
      {[[-8, -3.7], [-4, 3.7], [0, -3.7], [4, 3.7]].map(([z, x], i) => <WallSconce key={i} pos={[x, 2.3, z]} />)}
      <Lobby y={0} />
      {groundRooms.slice(0, 3).map((room, i) => (
        <Door3D key={room.id} pos={[-3.85, 0, -6 + i * 4.5]} rot={[0, Math.PI / 2, 0]} label={room.name} subLabel={room.bedConfig} color={room.color} onClick={() => onEnterRoom(room.id)} />
      ))}
      {groundRooms.slice(3).map((room, i) => (
        <Door3D key={room.id} pos={[3.85, 0, -6 + i * 4.5]} rot={[0, -Math.PI / 2, 0]} label={room.name} subLabel={room.bedConfig} color={room.color} onClick={() => onEnterRoom(room.id)} />
      ))}
      <Staircase pos={[-1.0, 0, -9]} onClick={onGoFirstFloor} />
      <Rug pos={[0, 0.01, 0]} w={2.8} d={24} color="#6b4c3b" />
    </group>
  )
}

function FirstFloor({ onEnterRoom, onGoGroundFloor }: { onEnterRoom: (id: string) => void; onGoGroundFloor: () => void }) {
  const firstRooms = ROOMS.filter((r) => r.floor === 'first')
  const Y = 5.0
  return (
    <group>
      <WoodFloor size={16} y={Y} />
      <Box args={[8, 0.15, 24]} position={[0, Y + 4.0, -1]}><meshStandardMaterial {...M.ceiling} /></Box>
      <Box args={[0.12, 4.0, 24]} position={[-4.0, Y + 2.0, -1]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.12, 4.0, 24]} position={[4.0, Y + 2.0, -1]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.05, 1.0, 24]} position={[-3.93, Y + 0.5, -1]}><meshStandardMaterial {...M.wallAccent} /></Box>
      <Box args={[0.05, 1.0, 24]} position={[3.93, Y + 0.5, -1]}><meshStandardMaterial {...M.wallAccent} /></Box>
      <Box args={[8, 4.0, 0.12]} position={[0, Y + 2.0, -9.0]}><meshStandardMaterial {...M.wall} /></Box>
      <group position={[0, Y, 10.5]}>
        {[-3.0, -1.0, 1.0, 3.0].map((x) => (
          <mesh key={x} position={[x, 1.0, 0]}>
            <boxGeometry args={[1.8, 1.6, 0.05]} />
            <meshStandardMaterial {...M.glassBalc} />
          </mesh>
        ))}
        <Box args={[8.0, 0.1, 0.1]} position={[0, 1.85, 0]}><meshStandardMaterial {...M.metalGold} /></Box>
        {[-3.8, -1.85, 0.05, 1.95, 3.85].map((x) => (
          <Box key={x} args={[0.07, 1.9, 0.07]} position={[x, 0.95, 0]}><meshStandardMaterial {...M.metalGold} /></Box>
        ))}
        <MountainBackdrop y={-Y} />
        <pointLight intensity={1.2} color="#fff0e0" distance={8} position={[0, 1.0, 0.5]} />
      </group>
      {[-6, -2, 2, 6].map((z) => <CeilingLight key={z} pos={[0, Y + 3.85, z]} />)}
      {[[-7, -3.7], [-3, 3.7], [1, -3.7], [5, 3.7]].map(([z, x], i) => <WallSconce key={i} pos={[x, Y + 2.3, z]} />)}
      <Text position={[0, Y + 3.5, 10.3]} fontSize={0.35} color="#c9a96e" anchorX="center" letterSpacing={0.15}>FIRST FLOOR</Text>
      <Text position={[0, Y + 3.1, 10.3]} fontSize={0.11} color="#8a8078" anchorX="center" letterSpacing={0.2}>PREMIUM SUITES &amp; ROOMS</Text>
      {firstRooms.slice(0, 2).map((room, i) => (
        <Door3D key={room.id} pos={[-3.85, Y, -3 + i * 5.5]} rot={[0, Math.PI / 2, 0]} label={room.name} subLabel={room.bedConfig} color={room.color} onClick={() => onEnterRoom(room.id)} />
      ))}
      {firstRooms.slice(2, 4).map((room, i) => (
        <Door3D key={room.id} pos={[3.85, Y, -3 + i * 5.5]} rot={[0, -Math.PI / 2, 0]} label={room.name} subLabel={room.bedConfig} color={room.color} onClick={() => onEnterRoom(room.id)} />
      ))}
      {firstRooms[4] && (
        <Door3D pos={[0, Y, -8.85]} rot={[0, Math.PI, 0]} label={firstRooms[4].name} subLabel={firstRooms[4].bedConfig} color={firstRooms[4].color} onClick={() => onEnterRoom(firstRooms[4].id)} />
      )}
      <group position={[2.5, Y + 0.5, -8.2]} onClick={(e) => { e.stopPropagation(); onGoGroundFloor() }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = 'default' }}>
        <Box args={[2.0, 0.46, 0.06]}><meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.5} /></Box>
        <Text position={[0, 0, 0.05]} fontSize={0.12} color="#1a1a1a" anchorX="center">\u2193 Ground Floor</Text>
      </group>
      <Rug pos={[0, Y + 0.01, 0]} w={2.8} d={20} color="#4a5060" />
      <Plant pos={[-2.5, Y, 8.5]} h={0.75} />
      <Plant pos={[2.5, Y, 8.5]} h={0.75} />
    </group>
  )
}

function RoomInterior({ zone, onExit }: { zone: string; onExit: () => void }) {
  const isFF = zone.startsWith('ff-')
  const y = isFF ? 5.0 : 0
  const walls = (w: number, d: number, h = 4.2) => (
    <>
      <Box args={[w, h, 0.12]} position={[0, y + h/2, -d/2]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.12, h, d]} position={[-w/2, y + h/2, 0]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[0.12, h, d]} position={[w/2, y + h/2, 0]}><meshStandardMaterial {...M.wall} /></Box>
      <Box args={[w, 0.12, d]} position={[0, y + h, 0]}><meshStandardMaterial {...M.ceiling} /></Box>
    </>
  )

  switch (zone) {
    case 'gf-master': return (
      <group>
        <FloorMarble size={10} tile={1.2} y={y} />
        {walls(10, 10)}
        <Window3D pos={[-4.88, y, 1]} w={2.2} h={1.7} yOff={1.3} mountainY={-y} />
        <CeilingLight pos={[0, y + 4.05, 0]} size={[0.45, 0.04, 1.1]} />
        <WallSconce pos={[4.85, y + 2.2, 1]} />
        <Bed pos={[0.5, y, 0.8]} fabricColor="#d4c4b4" />
        <Rug pos={[0.5, y + 0.01, 1.2]} w={4.0} d={3.0} color="#8b6f5c" />
        <TVUnit pos={[0, y, -4.2]} w={3.0} />
        <ArmChair pos={[-3.5, y, 2.8]} color="#c8bfb0" />
        <Desk pos={[3.8, y, 2.5]} />
        <Painting pos={[-4.85, y + 2.4, 0.5]} color="#2c4a6b" w={1.4} h={1.0} />
        <Painting pos={[4.85, y + 2.2, -2]} color="#4b6b3a" w={0.9} h={0.7} />
        <Door3D pos={[0, y, 4.85]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'gf-master-1-single': return (
      <group>
        <WoodFloor size={11} y={y} />
        {walls(11, 11)}
        <Window3D pos={[-5.38, y, 0.5]} w={2.4} h={1.7} yOff={1.3} mountainY={-y} />
        <CeilingLight pos={[-1.5, y + 4.05, 0]} /><CeilingLight pos={[2, y + 4.05, -1]} />
        <Bed pos={[-1, y, 0.5]} fabricColor="#c4d0dc" />
        <SingleBed pos={[3.5, y, 0.5]} fabricColor="#e8e0d4" />
        <Rug pos={[0, y + 0.01, 0.8]} w={5.0} d={3.0} color="#4a5060" />
        <TVUnit pos={[0, y, -5.0]} w={2.8} />
        <ArmChair pos={[4.5, y, 2.5]} color="#b8b0a0" />
        <Painting pos={[-5.38, y + 2.5, -1]} color="#6b4a2c" w={1.3} h={0.95} />
        <Door3D pos={[0, y, 5.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'gf-master-master': return (
      <group>
        <FloorMarble size={13} tile={1.3} y={y} />
        {walls(13, 13, 4.4)}
        <Window3D pos={[-6.38, y, 1.5]} w={2.8} h={2.0} yOff={1.4} mountainY={-y} />
        <Window3D pos={[-6.38, y, -1.5]} w={2.8} h={2.0} yOff={1.4} mountainY={-y} />
        <CeilingLight pos={[-2, y + 4.25, 1]} size={[0.45, 0.04, 1.1]} /><CeilingLight pos={[2, y + 4.25, -1]} size={[0.45, 0.04, 1.1]} />
        <Bed pos={[-2.5, y, 1.2]} fabricColor="#d4c4b4" /><Bed pos={[2.5, y, 1.2]} fabricColor="#c4d0dc" />
        <Rug pos={[0, y + 0.01, 1.5]} w={8.0} d={3.5} color="#6b4c3b" />
        <TVUnit pos={[0, y, -5.8]} w={4.0} />
        <ArmChair pos={[-5.5, y, 3.5]} color="#c9b8a0" /><ArmChair pos={[5.5, y, 3.5]} color="#c9b8a0" />
        <Painting pos={[0, y + 2.5, -6.37]} color="#2c4a6b" w={2.0} h={1.3} />
        <Plant pos={[-5.5, y, -4.0]} h={0.85} /><Plant pos={[5.5, y, -4.0]} h={0.85} />
        <Door3D pos={[0, y, 6.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'gf-master-2-single': return (
      <group>
        <WoodFloor size={13} y={y} />
        {walls(13, 13, 4.4)}
        <Window3D pos={[-6.38, y, 2]} w={3.0} h={2.0} yOff={1.5} mountainY={-y} />
        <CeilingLight pos={[-1.5, y + 4.25, 1.5]} /><CeilingLight pos={[2.0, y + 4.25, -1.0]} />
        <Bed pos={[-1.5, y, 0.5]} fabricColor="#c9b8a0" />
        <SingleBed pos={[3.5, y, -1.5]} fabricColor="#d4c4b4" /><SingleBed pos={[3.5, y, 1.5]} fabricColor="#d4c4b4" />
        <Rug pos={[0, y + 0.01, 0.5]} w={7.0} d={3.5} color="#8b6f5c" />
        <TVUnit pos={[0, y, -5.8]} w={3.5} />
        <ArmChair pos={[-5.5, y, 3.5]} color="#c8bfb0" />
        <Painting pos={[-6.37, y + 2.4, -0.5]} color="#6b4a2c" w={1.4} h={1.1} />
        <Plant pos={[5.5, y, -4.0]} h={0.8} />
        <Door3D pos={[0, y, 6.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'gf-3-single': return (
      <group>
        <WoodFloor size={11} y={y} />
        {walls(11, 11)}
        <Window3D pos={[-5.38, y, 0]} w={2.5} h={1.7} yOff={1.3} mountainY={-y} />
        <CeilingLight pos={[0, y + 4.05, 0]} /><CeilingLight pos={[0, y + 4.05, -2.5]} />
        <SingleBed pos={[-2.8, y, 0.5]} fabricColor="#c4d0dc" /><SingleBed pos={[0, y, 0.5]} fabricColor="#d4c4b4" /><SingleBed pos={[2.8, y, 0.5]} fabricColor="#e0d0c4" />
        <Rug pos={[0, y + 0.01, 0.8]} w={8.5} d={2.8} color="#4a5060" />
        <TVUnit pos={[0, y, -4.8]} w={2.5} />
        <Painting pos={[0, y + 2.5, -5.37]} color="#2c4a6b" w={1.6} h={1.1} />
        <Door3D pos={[0, y, 5.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'gf-2-single': return (
      <group>
        <FloorMarble size={10} tile={1.2} y={y} />
        {walls(10, 10)}
        <Window3D pos={[4.88, y, 0.5]} w={2.2} h={1.7} yOff={1.3} mountainY={-y} />
        <CeilingLight pos={[0, y + 4.05, 0]} />
        <SingleBed pos={[-1.8, y, 0.8]} fabricColor="#d4c4b4" /><SingleBed pos={[1.8, y, 0.8]} fabricColor="#c4d0dc" />
        <Rug pos={[0, y + 0.01, 1.0]} w={5.5} d={2.8} color="#8b6f5c" />
        <TVUnit pos={[0, y, -4.5]} w={2.8} />
        <ArmChair pos={[-3.8, y, 3.0]} color="#c8bfb0" />
        <Painting pos={[4.83, y + 2.3, -1]} color="#6b4a2c" w={1.2} h={0.9} />
        <Door3D pos={[0, y, 4.85]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'ff-master-1-single': return (
      <group>
        <WoodFloor size={11} y={y} />
        {walls(11, 11, 4.5)}
        <Window3D pos={[-5.38, y, 0.5]} w={2.8} h={2.0} yOff={1.5} mountainY={-y} />
        <Window3D pos={[5.38, y, 0.5]} w={2.8} h={2.0} yOff={1.5} mountainY={-y} />
        <CeilingLight pos={[-1.5, y + 4.35, 0.5]} /><CeilingLight pos={[2.0, y + 4.35, -1]} />
        <Bed pos={[-1, y, 0.8]} scale={1.05} fabricColor="#c9b8a0" />
        <SingleBed pos={[3.8, y, 0.8]} fabricColor="#d4c4b4" />
        <Rug pos={[0.5, y + 0.01, 1.2]} w={5.5} d={3.5} color="#6b4c3b" />
        <TVUnit pos={[0, y, -5.0]} w={3.0} />
        <ArmChair pos={[-4.8, y, 3.5]} color="#c9b8a0" />
        <Painting pos={[0, y + 2.6, -5.37]} color="#2c4a6b" w={1.8} h={1.2} />
        <Plant pos={[4.5, y, -3.5]} h={0.9} />
        <Door3D pos={[0, y, 5.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'ff-master-master': return (
      <group>
        <FloorMarble size={13} tile={1.3} y={y} />
        {walls(13, 13, 4.8)}
        <Window3D pos={[-6.38, y, 1.5]} w={3.2} h={2.4} yOff={1.6} mountainY={-y} />
        <Window3D pos={[-6.38, y, -1.5]} w={3.2} h={2.4} yOff={1.6} mountainY={-y} />
        <CeilingLight pos={[-2.5, y + 4.65, 1.5]} size={[0.45, 0.04, 1.1]} /><CeilingLight pos={[2.5, y + 4.65, -1.5]} size={[0.45, 0.04, 1.1]} />
        <Bed pos={[-2.5, y, 1.5]} scale={1.05} fabricColor="#c9a96e" /><Bed pos={[2.5, y, 1.5]} scale={1.05} fabricColor="#c4d0dc" />
        <Rug pos={[0, y + 0.01, 2.0]} w={9.0} d={4.0} color="#4a5060" />
        <TVUnit pos={[0, y, -6.0]} w={4.5} />
        <ArmChair pos={[-6, y, 4.0]} color="#c9b8a0" /><ArmChair pos={[6, y, 4.0]} color="#c9b8a0" />
        <Painting pos={[0, y + 2.8, -6.37]} color="#2c4a6b" w={2.5} h={1.6} />
        <Plant pos={[-6, y, -4.5]} h={1.0} /><Plant pos={[6, y, -4.5]} h={1.0} />
        <Door3D pos={[0, y, 6.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'ff-single-single-master': return (
      <group>
        <WoodFloor size={13} y={y} />
        {walls(13, 13, 4.8)}
        <Window3D pos={[6.38, y, 1]} w={3.0} h={2.2} yOff={1.5} mountainY={-y} />
        <Window3D pos={[6.38, y, -2]} w={3.0} h={2.2} yOff={1.5} mountainY={-y} />
        <CeilingLight pos={[-1.5, y + 4.65, 1]} /><CeilingLight pos={[2, y + 4.65, -1.5]} />
        <Bed pos={[-1.5, y, 0.5]} scale={1.05} fabricColor="#d4c4b4" />
        <SingleBed pos={[3.8, y, -1.5]} fabricColor="#c4d0dc" /><SingleBed pos={[3.8, y, 1.5]} fabricColor="#d4c4b4" />
        <Rug pos={[0.5, y + 0.01, 0.5]} w={8.0} d={4.0} color="#8b6f5c" />
        <TVUnit pos={[0, y, -6.0]} w={3.8} />
        <ArmChair pos={[-5.8, y, 3.5]} color="#c8bfb0" />
        <Desk pos={[-5.8, y, 0]} />
        <Painting pos={[-6.37, y + 2.6, -2]} color="#4b6b3a" w={1.6} h={1.2} />
        <Plant pos={[5.5, y, -5.0]} h={0.9} />
        <Door3D pos={[0, y, 6.35]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'ff-single-single': return (
      <group>
        <FloorMarble size={10} tile={1.2} y={y} />
        {walls(10, 10, 4.5)}
        <Window3D pos={[4.88, y, 0]} w={2.6} h={2.0} yOff={1.4} mountainY={-y} />
        <CeilingLight pos={[0, y + 4.35, 0]} />
        <SingleBed pos={[-1.8, y, 0.8]} fabricColor="#c9a96e" /><SingleBed pos={[1.8, y, 0.8]} fabricColor="#c4d0dc" />
        <Rug pos={[0, y + 0.01, 1.0]} w={5.5} d={3.0} color="#4a5060" />
        <TVUnit pos={[0, y, -4.5]} w={2.8} />
        <ArmChair pos={[-4.0, y, 3.2]} color="#c9b8a0" />
        <Painting pos={[0, y + 2.6, -4.87]} color="#2c4a6b" w={1.6} h={1.1} />
        <Door3D pos={[0, y, 4.85]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    case 'ff-master': return (
      <group>
        <FloorMarble size={10} tile={1.2} y={y} />
        {walls(10, 10, 4.5)}
        <Window3D pos={[-4.88, y, 0]} w={3.0} h={2.2} yOff={1.5} mountainY={-y} />
        <CeilingLight pos={[0, y + 4.35, 0]} size={[0.45, 0.04, 1.2]} />
        <WallSconce pos={[4.85, y + 2.2, 0.5]} />
        <Bed pos={[0, y, 0.8]} scale={1.1} fabricColor="#c9a96e" />
        <Rug pos={[0, y + 0.01, 1.2]} w={4.2} d={3.2} color="#6b4c3b" />
        <TVUnit pos={[0, y, -4.5]} w={3.0} />
        <ArmChair pos={[-3.8, y, 3.2]} color="#c9a96e" />
        <Desk pos={[3.8, y, 2.5]} />
        <Painting pos={[-4.83, y + 2.7, -1.5]} color="#2c4a6b" w={1.5} h={1.2} />
        <Painting pos={[4.83, y + 2.4, 0.5]} color="#4b6b3a" w={0.9} h={0.7} />
        <Plant pos={[4.3, y, -3.5]} h={1.0} />
        <Door3D pos={[0, y, 4.85]} rot={[0, 0, 0]} label="Exit" color="#5c4a3a" onClick={onExit} />
      </group>
    )
    default: return null
  }
}

function CameraRig({ zone }: { zone: TourZone }) {
  const ctrlRef = useRef<CameraControls>(null)
  useEffect(() => {
    const preset = CAMERA_PRESETS[zone] ?? CAMERA_PRESETS.ground
    const ctrl = ctrlRef.current
    if (!ctrl) return
    ctrl.setLookAt(...preset.pos, ...preset.target, true)
  }, [zone])
  return <CameraControls ref={ctrlRef} minDistance={2} maxDistance={18} maxPolarAngle={Math.PI / 2.05} />
}

function SceneContent({ zone, floor, onEnterRoom, onExitRoom, onFloorChange }: HotelSceneProps) {
  const isRoom = zone !== 'ground' && zone !== 'first'
  return (
    <>
      <ambientLight intensity={0.4} color="#fff8f0" />
      <directionalLight position={[10, 14, 8]} intensity={0.7} castShadow shadow-mapSize={[1024, 1024]} color="#fff5e8" />
      <directionalLight position={[-8, 10, -5]} intensity={0.3} color="#d0e8ff" />
      <Environment preset="apartment" />
      {isRoom ? (
        <RoomInterior zone={zone} onExit={onExitRoom} />
      ) : (
        <>
          {floor === 'ground' && <GroundFloor onEnterRoom={onEnterRoom} onGoFirstFloor={() => onFloorChange('first')} />}
          {floor === 'first'  && <FirstFloor  onEnterRoom={onEnterRoom} onGoGroundFloor={() => onFloorChange('ground')} />}
        </>
      )}
      <CameraRig zone={zone} />
    </>
  )
}

export default function Hotel3DScene({ zone, floor, onEnterRoom, onExitRoom, onFloorChange }: HotelSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2.8, 13], fov: 52 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: window.devicePixelRatio < 2, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#ddd8d0']} />
      <fog attach="fog" args={['#ddd8d0', 14, 40]} />
      <Suspense fallback={null}>
        <SceneContent zone={zone} floor={floor} onEnterRoom={onEnterRoom} onExitRoom={onExitRoom} onFloorChange={onFloorChange} />
      </Suspense>
    </Canvas>
  )
}
