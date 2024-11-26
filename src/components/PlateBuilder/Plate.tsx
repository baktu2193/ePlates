"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Plate, PlateSize } from "../../../PlateStyles";

// Create a rounded rectangle shape
const createRoundedRectShape = (width: number, height: number, radius: number) => {
  const shape = new THREE.Shape();
  const x = -width / 2; // Center the shape horizontally
  const y = -height / 2; // Center the shape vertically

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
};

interface PlateProps{
  plateStyle: Plate;
  plateNumber:string,
  isRear:boolean,
  size:PlateSize
}

const ThreeDRectangle = ({ plateNumber, isRear,plateStyle }: PlateProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [textMesh, setTextMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    setScene(scene); // Set the scene once

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 10); // Camera positioned to view the plate and text

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x202020); // Dark background color
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Softer light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Define the plate geometry
    const roundedRectShape = createRoundedRectShape(22, 4.5, 0.5); // Width, height, corner radius
    const extrudeSettings = {
      depth: 0.2, // Thickness of the plate
      bevelEnabled: false, // Disable bevel for sharp edges
    };

    const plateGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const plateMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Slightly off-white color
      roughness: 0,
      metalness: 0,
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.rotation.y = 0; // Reset any previous Y-axis rotation
    plate.rotation.x = 0; // Ensure no X-axis rotation    
    plate.position.set(0, 0, 0); // Center the plate
    scene.add(plate);

    const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Use plate style properties (thickness, height, and fontSize) dynamically
  const textGeometry = new TextGeometry(plateNumber, {
    font,
    size: 3, // This controls the height of the letters (Y-axis)
    height: plateStyle.material.thickness==null?0:plateStyle.material.thickness/10, // This controls the extrusion depth (Z-axis thickness)
    curveSegments: 12, // Controls curve smoothness
  });

  // Use material settings for text
  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Color for the text
    roughness: 0.5, // Smoothness
    metalness: 0.5, // Slight reflection
  });

  // Create the text mesh with the geometry and material
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Compute the bounding box of the text geometry to center the text properly
  textGeometry.computeBoundingBox(); // Get bounding box to determine size
  const textWidth = textGeometry.boundingBox?.max.x - textGeometry.boundingBox?.min.x || 0;
  const textHeight = textGeometry.boundingBox?.max.y - textGeometry.boundingBox?.min.y || 0;

  console.log('Text Height:', textHeight); // Log the text height

  // Adjust the position to center the text horizontally and vertically within the plate
  textMesh.position.set(
    -textWidth / 2, // Center horizontally
    -textHeight / 2, // Center vertically based on text height
    0.3             // Adjust the depth to place in front of the plate
  );

  // Add textMesh to the scene
  scene.add(textMesh);

  // Set text mesh in state (if necessary for updating or interactions)
  setTextMesh(textMesh);
});


    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []); // Run only once when the component is mounted

  useEffect(() => {
    if (textMesh && plateStyle && plateNumber) {
      console.log("Updating text geometry with new plateStyle:", plateStyle);
      
      // Load the font and create new geometry
      const fontLoader = new FontLoader();
      fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
        // Ensure that the font is loaded before proceeding
        if (!font) {
          console.error("Font loading failed");
          return;
        }
  
        const textGeometry = new TextGeometry(plateNumber, {
          font,
          size: 3, // Use font size from plateStyle
          height: plateStyle.material.thickness==null?0:plateStyle.material.thickness/10, // This controls the extrusion depth (Z-axis thickness)          curveSegments: 12,
        });
  
        // Log to check geometry update
        console.log("New text geometry created with size:", 3, "and height:", plateStyle.material.thickness==null?0:plateStyle.material.thickness/10);
  
        // Dispose old geometry before setting the new one
        if (textMesh.geometry) {
          textMesh.geometry.dispose();
        }
        
        // Set new geometry
        textMesh.geometry = textGeometry;
  
        // Compute bounding box and check if valid
        textGeometry.computeBoundingBox();
        if (textGeometry.boundingBox) {
          const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x || 0;
          const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y || 0;
  
          console.log("Updated text width:", textWidth, "text height:", textHeight);
  
          // Update the position of the mesh based on bounding box
          textMesh.position.set(
            -textWidth / 2,
            -1.1, // Adjust the vertical position
            0.3   // Adjust depth (Z axis) if needed
          );
        } else {
          console.warn("Bounding box calculation failed for text geometry.");
        }
      });
    }
  }, [plateNumber, plateStyle, textMesh]); // Dependencies for when these change
    
  

  return <div ref={mountRef} style={{ backgroundColor:'white',width: "100%", height: "100%" }} />;
};

export default ThreeDRectangle;
