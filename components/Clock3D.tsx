"use client"
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Clock3D = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(100, 100) // Increased size
    containerRef.current.appendChild(renderer.domElement)

    // Clock geometry
    const clockGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32)
    const clockMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4a5568, // Darker color
      specular: 0x999999,
      shininess: 50
    })
    const clock = new THREE.Mesh(clockGeometry, clockMaterial)
    clock.rotation.x = Math.PI / 2 // Rotate to face camera
    scene.add(clock)

    // Clock hands
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.4, 0.02),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.6, 0.02),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    const secondHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.7, 0.01),
      new THREE.MeshPhongMaterial({ color: 0xff4444 })
    )

    // Position hands at center
    hourHand.position.y = 0.2
    minuteHand.position.y = 0.3
    secondHand.position.y = 0.35

    // Add clock markers
    for (let i = 0; i < 12; i++) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.1, 0.01),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
      )
      marker.position.y = 0.9
      marker.rotation.z = (i * Math.PI) / 6
      clock.add(marker)
    }

    clock.add(hourHand, minuteHand, secondHand)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(ambientLight, directionalLight)

    // Camera position
    camera.position.z = 2.5

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      const now = new Date()
      const hours = now.getHours() % 12
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const milliseconds = now.getMilliseconds()

      // Smooth rotation for second hand
      const smoothSeconds = (seconds + milliseconds / 1000) * Math.PI / 30
      
      hourHand.rotation.z = -((hours + minutes / 60) * Math.PI / 6)
      minuteHand.rotation.z = -(minutes * Math.PI / 30)
      secondHand.rotation.z = -smoothSeconds

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      scene.remove(clock)
      clockGeometry.dispose()
      clockMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-[100px] h-[100px] bg-transparent rounded-full overflow-hidden"
      style={{ transform: 'translateZ(0)' }} // Hardware acceleration
    />
  )
}

export default Clock3D 