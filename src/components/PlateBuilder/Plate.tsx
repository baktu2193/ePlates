"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Border, Plate, PlateSize } from "../../../PlateStyles";

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

// Create the hollow border shape
const createHollowBorderShape = (width: number, height: number, radius: number, borderThickness: number) => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  // Outer border shape
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  // Inner cut-out shape (matches plate size exactly)
  const innerShape = new THREE.Shape();
  const innerX = x + borderThickness; // Offset for the border
  const innerY = y + borderThickness;

  innerShape.moveTo(innerX + radius, innerY);
  innerShape.lineTo(innerX + width - 2 * borderThickness - radius, innerY);
  innerShape.quadraticCurveTo(innerX + width - 2 * borderThickness, innerY, innerX + width - 2 * borderThickness, innerY + radius);
  innerShape.lineTo(innerX + width - 2 * borderThickness, innerY + height - 2 * borderThickness - radius);
  innerShape.quadraticCurveTo(innerX + width - 2 * borderThickness, innerY + height - 2 * borderThickness, innerX + width - 2 * borderThickness - radius, innerY + height - 2 * borderThickness);
  innerShape.lineTo(innerX + radius, innerY + height - 2 * borderThickness);
  innerShape.quadraticCurveTo(innerX, innerY + height - 2 * borderThickness, innerX, innerY + height - 2 * borderThickness - radius);
  innerShape.lineTo(innerX, innerY + radius);
  innerShape.quadraticCurveTo(innerX, innerY, innerX + radius, innerY);

  // Subtract inner shape to create hollow effect
  shape.holes.push(innerShape);

  return shape;
};

interface PlateProps{
  plateStyle: Plate;
  plateNumber:string,
  isRear:boolean,
  size?:PlateSize,
  border:Border,
}

const ThreeDRectangle = ({ plateNumber, isRear,plateStyle,size={key:"11x8",width:20,height:5},border }: PlateProps) => {
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

    const renderer = new THREE.WebGLRenderer({ antialias: true });  // Enable antialiasing
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x202020); // Dark background color
    
    // Optional: Enable performance optimizations
    renderer.shadowMap.enabled = true;  // Enable shadows if needed
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows for smoother appearance
    
    // Add the renderer's DOM element to the mount element
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
      color: 0xf1f0e6, // Slightly off-white color for a soft, creamy appearance
      roughness: 0.9,   // Less roughness for a smoother, glossier look (still matte)
      metalness: 0.1,   // A little metallic sheen for a plastic-like finish
      emissive: 0xffffff, // Matching the base color for a subtle glow
      emissiveIntensity: 0.5, // Reduce emissive intensity for a more natural look
      clearcoat: 0.8,    // A thin clearcoat for an extra glossy finish (optional)
      clearcoatRoughness: 0.1, // Slight roughness on the clearcoat for realistic shine
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
    size: 1.9, // This controls the height of the letters (Y-axis)
    height: plateStyle.material.thickness==null?0:plateStyle.material.thickness/10, // This controls the extrusion depth (Z-axis thickness)
    curveSegments: 256, // Controls curve smoothness
  });

  // Use material settings for text
  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Color for the text
    roughness: 1, // Smoothness
    metalness: 0, // Slight reflection
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
    0.1             // Adjust the depth to place in front of the plate
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
      renderer.setClearColor(0xffffff); // White background color
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
    if (scene && size) {
      // Create the plate geometry first
      const roundedRectShape = createRoundedRectShape(size.width, size.height, 0.5);
      const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: false, // Optional: Set to true if you want bevels
        curveSegments: 256,
      };
  
      const plateGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
  
      // Find the existing plate mesh
      const plateMesh = scene.children.find((child) => child instanceof THREE.Mesh) as THREE.Mesh;
      if (plateMesh) {
        plateMesh.geometry.dispose(); // Dispose of the old geometry
        plateMesh.geometry = plateGeometry; // Set the new geometry
  
        // Scale the plate for easier viewing (after updating geometry)
        const scaleFactor = 1; // Adjust this factor as needed
        plateMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Update the plate color based on isRear state
        if (isRear) {
          plateMesh.material.color.set(0xffcd29); // Set to yellow if isRear is true
        } else {
          plateMesh.material.color.set(0xf8f4e1); // Lighter milk color for the front
        }

  
        // Remove the existing border mesh if it exists
        const existingBorderMesh = scene.children.find(
          (child) => child.name === 'borderMesh'
        );
        if (existingBorderMesh) {
          scene.remove(existingBorderMesh); // Remove the old border from the scene
          existingBorderMesh.geometry.dispose(); // Dispose of old geometry
          existingBorderMesh.material.dispose(); // Dispose of old material
        }
  
        // Create the border geometry with the scaled size
        const borderGeometry = new THREE.ExtrudeGeometry(
          createHollowBorderShape(size.width * scaleFactor, size.height * scaleFactor, 0.5, border.material.thickness / 20), {
            depth: 0.3, // Depth of the border
            bevelEnabled: false,
          }
        );
  
        // Apply material to the border
        const borderMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000, // Border color (black)
           // Render both sides of the border
        });
  
        // Create the border mesh and add it to the scene
        const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
        borderMesh.position.set(0, 0, 0.15); // Position it slightly above the plate
        borderMesh.name = 'borderMesh'; // Set a name to easily find it later
  
        // Add the new border mesh to the scene
        scene.add(borderMesh);
      }
    }
  
    if (textMesh && plateStyle && plateNumber) {
      console.log("Updating text geometry with new plateStyle:", plateStyle);
    
      // Dispose of the old text mesh if it exists
      if (textMesh.geometry) {
        textMesh.geometry.dispose();
      }
      if (textMesh.material) {
        textMesh.material.dispose();
      }
    
      // Dispose of the old black layer mesh if it exists
      const existingBlackLayer = scene.children.find(child => child.name === "blackLayerMesh");
      if (existingBlackLayer) {
        existingBlackLayer.geometry.dispose();
        existingBlackLayer.material.dispose();
        scene.remove(existingBlackLayer); // Remove it from the scene
      }
    
      // Load the font and create new geometry
      const fontLoader = new FontLoader();
      fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
        if (!font) {
          console.error("Font loading failed");
          return;
        }
    
        // Create the base colored text geometry
        const textGeometry = new TextGeometry(plateNumber, {
          font,
          size: 1.9, // Use font size from plateStyle
          height: plateStyle.material.thickness == null ? 0 : plateStyle.material.thickness / 10,
          curveSegments: 128,
        });
    
        // Create the thin black layer geometry
        const blackLayerGeometry = new TextGeometry(plateNumber, {
          font,
          size: 1.9, // Same size as the base text
          height: 0.1, // Very thin layer
          curveSegments: 128,
        });
    
        // Check if the plate style name contains "GEL"
        const isGelPlate = /GEL/i.test(plateStyle.name); // This checks if "GEL" is in plateStyle.name, case-insensitive
    
        // If the plateStyle name contains "GEL", apply the glowing effect
        if (isGelPlate) {
          // Apply a glowing material effect for "GEL" plate
          const gelMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // Green color to represent "GEL"
            emissive: 0x00ff00, // Makes it glow
            emissiveIntensity: 1.5, // Glow intensity
            
          });
    
          // Create the text mesh with the colored material
          textMesh.material = gelMaterial;
        } else {
          // Default color for the text
          textMesh.material = new THREE.MeshBasicMaterial({
            color: 0x000000, // Black color for default text
            
          });
        }
    
        // Set the new geometry for the text
        textMesh.geometry = textGeometry;
    
        // Create the black top layer mesh for the text
        const blackLayerMesh = new THREE.Mesh(blackLayerGeometry, new THREE.MeshBasicMaterial({
          color: 0x000000, // Black color for the top layer
          
        }));
    
        // Position the black top layer exactly on top of the main text
        const textDepth = plateStyle.material.thickness == null ? 0 : plateStyle.material.thickness / 10;
        blackLayerMesh.position.set(0, 0, textDepth + 0.1); // Slight offset on Z-axis
    
        // Add the black top layer mesh to the scene and give it a name for easy reference
        blackLayerMesh.name = "blackLayerMesh";
        scene.add(blackLayerMesh);
    
        // Compute the bounding box of the text geometry to center the text properly
        textGeometry.computeBoundingBox(); // Get bounding box to determine size
    
        if (textGeometry.boundingBox) {
          // Calculate the width and height of the text geometry
          let textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x || 0;
          let textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y || 0;
        
          console.log("Updated text width:", textWidth, "text height:", textHeight);
        
          // Ensure the text fits inside the plate
          const plateWidth = size.width * 0.7; // Adjust for plate scale
          const plateHeight = size.height * 0.7;
        
          // Scale down the text if it's too wide for the plate
          if (textWidth > plateWidth) {
            const scaleFactor = plateWidth / textWidth;
            textMesh.scale.set(scaleFactor, scaleFactor, 1);
            blackLayerMesh.scale.set(scaleFactor, scaleFactor, 1); // Scale the black layer as well
        
            // Recompute the bounding box after scaling
            textGeometry.computeBoundingBox(); 
            if (textGeometry.boundingBox) {
              textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x || 0;
              textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y || 0;
            }
          }
        
          // Adjust the position of the text and black layer to keep them centered
          // Updated centering logic after scaling
          const offsetX = -textWidth / 2; // Offset to center horizontally
          const offsetY = -textHeight / 2; // Offset to center vertically
        
          // Ensure the text and the black layer are both properly centered and aligned
          textMesh.position.set(offsetX, offsetY, 0.1); // Adjusted for centering
          blackLayerMesh.position.set(offsetX, offsetY, (plateStyle.material.thickness/10)+0.15); // Same position for the black layer
        
        } else {
          console.warn("Bounding box calculation failed for text geometry.");
        }
                
      });
    }
    
        
  }, [scene, size, plateNumber, plateStyle, textMesh, border, isRear]); // Add isRear to dependency array
  

  return <div ref={mountRef} style={{ backgroundColor:'white',width: "100%", height: "100%" }} />;
};

export default ThreeDRectangle;
