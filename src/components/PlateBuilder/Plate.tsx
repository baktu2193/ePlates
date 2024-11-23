"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDRectangle = ({plateNumber,isRear}:{plateNumber:string,isRear:boolean}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize only once
    if (!sceneRef.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        200
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 10, 10);
      scene.add(light);

      // Create a 3D Rectangle (plate) with physical material for a milky, shiny effect
      const geometry = new THREE.BoxGeometry(6, 0.2, 1); // Increased width to 6
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee, // Slightly milky white color
        emissive: 0xeeeeee, // Milky emissive glow
        emissiveIntensity: 0.8, // Less intense glow
        roughness: 0.1, // Smooth surface for some shine
        metalness: 0.5, // More reflectivity for a shiny effect
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.rotation.x = Math.PI / 2; // Rotate plate to be vertical (on the wall)
      scene.add(cube);
      cubeRef.current = cube;

      // Set up camera position
      camera.position.z = 5;

      // Add OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.enableDamping = true; // Smooth transitions
      controls.zoomSpeed = 1.5; // Faster zoom
      controlsRef.current = controls;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle container resizing
      const handleResize = () => {
        if (mountRef.current) {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      };

      // Resize event listener for container
      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        renderer.dispose();
        if (mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
};

export default ThreeDRectangle;
