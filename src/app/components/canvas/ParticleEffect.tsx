'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring } from 'framer-motion';

interface ParticleProps {
  count?: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

interface Velocity {
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  speed: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

// Create a set of particles that will be animated
const Particles = ({ count = 100, mouse }: ParticleProps) => {
  const mesh = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  // Generate initial random positions and velocities for particles
  const [particles] = useState(() => {
    const positions = new Float32Array(count * 3);
    const velocities: Velocity[] = Array(count).fill(null).map(() => {
      // Create wider initial distribution
      const baseX = (Math.random() - 0.5) * 15;
      const baseY = (Math.random() - 0.5) * 15;
      const baseZ = (Math.random() - 0.5) * 10;
      
      return {
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        vz: (Math.random() - 0.5) * 0.005,
        // Random phase offset for smooth animation
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        // Store base position for each particle to return to
        baseX,
        baseY,
        baseZ
      };
    });
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute particles more widely
      positions[i3] = velocities[i].baseX;
      positions[i3 + 1] = velocities[i].baseY;
      positions[i3 + 2] = velocities[i].baseZ;
    }
    
    return { positions, velocities };
  });

  // Use a reference time for smooth animation
  const timeRef = useRef<number>(0);
  const lastMousePos = useRef<{x: number, y: number}>({x: 0, y: 0});
  const mouseVelocity = useRef<{x: number, y: number}>({x: 0, y: 0});

  useFrame((state, delta) => {
    if (mesh.current && mouse.current) {
      timeRef.current += delta * 0.8; // Double the time progression for faster animation
      
      // Calculate mouse velocity for more responsive movement
      const mouseX = (mouse.current.x / aspect) * 2;
      const mouseY = -(mouse.current.y / aspect) * 2;
      
      // Update mouse velocity
      mouseVelocity.current.x = (mouseX - lastMousePos.current.x) * 3;
      mouseVelocity.current.y = (mouseY - lastMousePos.current.y) * 3;
      
      // Save current mouse position for next frame
      lastMousePos.current.x = mouseX;
      lastMousePos.current.y = mouseY;
      
      // Adjust the positions based on the mouse movement and flowing animation
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Get the current positions
        const x = mesh.current.geometry.attributes.position.array[i3] as number;
        const y = mesh.current.geometry.attributes.position.array[i3 + 1] as number;
        const z = mesh.current.geometry.attributes.position.array[i3 + 2] as number;
        
        // Get particle velocity
        const vel = particles.velocities[i];
        
        // Calculate distance to mouse with increased influence range
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate "home" force - much weaker tendency to return to base position
        // This allows more free movement while still preventing clustering
        const homeX = (vel.baseX - x) * 0.001; // Keep weak home pull
        const homeY = (vel.baseY - y) * 0.001; // Keep weak home pull
        const homeZ = (vel.baseZ - z) * 0.001; // Keep weak home pull
        
        // Enhanced mouse attraction when mouse is moving
        const moveFactor = Math.sqrt(mouseVelocity.current.x ** 2 + mouseVelocity.current.y ** 2);
        const mouseForce = 0.15 * Math.min(1, moveFactor * 2); // Increased from 0.12
        
        // Mouse influence based on distance - stronger when closer
        const mouseInfluence = mouseForce / (dist * 0.4 + 1);
        
        // Add a smooth flowing movement using sine waves with different phases - even stronger flows
        const time = timeRef.current;
        const flowX = Math.sin(time + vel.phase) * vel.speed * 0.03; // Increased from 0.02
        const flowY = Math.cos(time * 0.8 + vel.phase) * vel.speed * 0.03; // Increased from 0.02
        const flowZ = Math.sin(time * 0.5 + vel.phase * 2) * vel.speed * 0.015; // Increased from 0.01
        
        // Update velocities with smooth damping - less damping for more fluid movement
        // Add mouse velocity influence for particles to follow cursor trail
        vel.vx = vel.vx * 0.85 + (dx * mouseInfluence + homeX + flowX + mouseVelocity.current.x * 0.04) * 0.15;
        vel.vy = vel.vy * 0.85 + (dy * mouseInfluence + homeY + flowY + mouseVelocity.current.y * 0.04) * 0.15;
        vel.vz = vel.vz * 0.9 + (homeZ + flowZ) * 0.1;
        
        // Apply velocity to position with increased speed
        mesh.current.geometry.attributes.position.array[i3] = x + vel.vx * delta * 5.0; // Much faster movement
        mesh.current.geometry.attributes.position.array[i3 + 1] = y + vel.vy * delta * 5.0; // Much faster movement
        mesh.current.geometry.attributes.position.array[i3 + 2] = z + vel.vz * delta * 5.0; // Much faster movement
        
        // Contain particles within bounds with soft boundaries - larger boundary
        const bound = 25; // Keep same boundary size
        const softness = 0.08; // Keep same softness
        
        if (Math.abs(x) > bound) {
          vel.vx -= Math.sign(x) * softness;
        }
        
        if (Math.abs(y) > bound) {
          vel.vy -= Math.sign(y) * softness;
        }
        
        if (Math.abs(z) > bound) {
          vel.vz -= Math.sign(z) * softness;
        }
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.12} 
        color="#ffffff" 
        sizeAttenuation 
        transparent 
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
};

const ParticleEffect = () => {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 50, damping: 12 }); // Better spring response
  const springY = useSpring(0, { stiffness: 50, damping: 12 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      springX.set(x);
      springY.set(y);
    };

    const updateMouseRef = () => {
      mouseRef.current = { x: springX.get(), y: springY.get() };
      requestAnimationFrame(updateMouseRef);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(updateMouseRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [springX, springY]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles count={200} mouse={mouseRef} />
      </Canvas>
    </div>
  );
};

export default ParticleEffect; 