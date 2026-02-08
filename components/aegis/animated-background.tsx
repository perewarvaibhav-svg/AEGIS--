'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Floating particle grid ─── */
function ParticleGrid() {
  const meshRef = useRef<THREE.Points>(null)
  const COUNT = 2000
  const SPREAD = 30

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 1] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 2] = (Math.random() - 0.5) * SPREAD
      vel[i3] = (Math.random() - 0.5) * 0.003
      vel[i3 + 1] = (Math.random() - 0.5) * 0.003
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return [pos, vel]
  }, [])

  const sizes = useMemo(() => {
    const s = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      s[i] = Math.random() * 1.5 + 0.3
    }
    return s
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const half = SPREAD / 2
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      arr[i3] += velocities[i3]
      arr[i3 + 1] += velocities[i3 + 1]
      arr[i3 + 2] += velocities[i3 + 2]
      if (arr[i3] > half || arr[i3] < -half) velocities[i3] *= -1
      if (arr[i3 + 1] > half || arr[i3 + 1] < -half) velocities[i3 + 1] *= -1
      if (arr[i3 + 2] > half || arr[i3 + 2] < -half) velocities[i3 + 2] *= -1
    }
    posAttr.needsUpdate = true
    meshRef.current.rotation.y += 0.0003
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#10b981"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Connection lines between nearby particles ─── */
function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null)
  const NODE_COUNT = 120
  const SPREAD = 20
  const CONNECT_DIST = 4.5

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3)
    const vel = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 1] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5
      vel[i3] = (Math.random() - 0.5) * 0.006
      vel[i3 + 1] = (Math.random() - 0.5) * 0.006
      vel[i3 + 2] = (Math.random() - 0.5) * 0.003
    }
    return [pos, vel]
  }, [])

  const linePositions = useMemo(() => new Float32Array(NODE_COUNT * NODE_COUNT * 6), [])

  useFrame(() => {
    if (!lineRef.current) return
    const half = SPREAD / 2
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]
      if (positions[i3] > half || positions[i3] < -half) velocities[i3] *= -1
      if (positions[i3 + 1] > half || positions[i3 + 1] < -half) velocities[i3 + 1] *= -1
      if (positions[i3 + 2] > half * 0.5 || positions[i3 + 2] < -half * 0.5) velocities[i3 + 2] *= -1
    }

    let idx = 0
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < CONNECT_DIST) {
          linePositions[idx++] = positions[i * 3]
          linePositions[idx++] = positions[i * 3 + 1]
          linePositions[idx++] = positions[i * 3 + 2]
          linePositions[idx++] = positions[j * 3]
          linePositions[idx++] = positions[j * 3 + 1]
          linePositions[idx++] = positions[j * 3 + 2]
        }
      }
    }

    const geom = lineRef.current.geometry
    const attr = geom.attributes.position as THREE.BufferAttribute
    ;(attr.array as Float32Array).set(linePositions.subarray(0, idx))
    attr.needsUpdate = true
    geom.setDrawRange(0, idx / 3)
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#10b981"
        transparent
        opacity={0.07}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

/* ─── Scanning ring that sweeps vertically ─── */
function ScanRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const t = clock.getElapsedTime()
    ringRef.current.position.y = Math.sin(t * 0.3) * 8
    ringRef.current.rotation.x = Math.PI / 2
    const scale = 12 + Math.sin(t * 0.5) * 2
    ringRef.current.scale.set(scale, scale, 1)
    const mat = ringRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.04 + Math.abs(Math.sin(t * 0.3)) * 0.04
  })

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshBasicMaterial
        color="#10b981"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ─── Slow orbiting torus wireframe ─── */
function OrbitalRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * 0.05
    ref.current.rotation.y = t * 0.08
    ref.current.rotation.z = t * 0.03
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[10, 0.015, 16, 100]} />
      <meshBasicMaterial
        color="#10b981"
        transparent
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ─── Main export ─── */
export function AnimatedBackground() {
  const handleCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    state.gl.setClearColor('#000000', 1)
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        dpr={[1, 2]}
        onCreated={handleCreated}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <ParticleGrid />
        <ConnectionLines />
        <ScanRing />
        <OrbitalRing />
      </Canvas>
    </div>
  )
}
