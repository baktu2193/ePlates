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


// Function to create and add a spotlight to the scene
const addSpotlight = (scene: THREE.Scene, position: { x: number, y: number, z: number }, targetPosition: { x: number, y: number, z: number }, color: number = 0xffffff, intensity: number = 1) => {
  // Create the spotlight
  const spotlight = new THREE.SpotLight(color, intensity);

  // Set the spotlight position
  spotlight.position.set(position.x, position.y, position.z);

  // Make the spotlight target the specified position (can be the plate or any other object)
  spotlight.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);

  // Enable shadows for the spotlight (optional)
  spotlight.castShadow = true;

  // Add the spotlight to the scene
  scene.add(spotlight);

  // Optionally add a helper to visualize the spotlight in the scene (for debugging)
  const spotLightHelper = new THREE.SpotLightHelper(spotlight);
  scene.add(spotLightHelper);
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
    directionalLight.position.set(4, 4.2, 5);
    scene.add(directionalLight);

    // // Add spotlight
    // addSpotlight(scene, 
    //   { x: size.width * 0.8, y: size.height * 0.2, z: 30 }, // Position the light 1/5th from the top and on the right side
    //   { x: 0, y: 0, z: 0 }, // Target the center of the plate
    //   0xffffff, // Color of the spotlight
    //   2 // Intensity of the spotlight
    // );

    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight2.position.set(-5, -5, 5); // Mirror position relative to the left and bottom
    // scene.add(directionalLight2);


    // Define the plate geometry
    const roundedRectShape = createRoundedRectShape(22, 4.5, 0.5); // Width, height, corner radius
    const extrudeSettings = {
      depth: 0.2, // Thickness of the plate
      bevelEnabled: false, // Disable bevel for sharp edges
    };

    const plateGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const plateMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf1f0e6, // Slightly off-white color for a soft, creamy appearance
      roughness: 1,   // Less roughness for a smoother, glossier look (still matte)
      metalness: 0.1,   // A little metallic sheen for a plastic-like finish
      emissive: 0xffffff, // Matching the base color for a subtle glow
      emissiveIntensity: 1, // Reduce emissive intensity for a more natural look
      clearcoat: 0.8,    // A thin clearcoat for an extra glossy finish (optional)
      clearcoatRoughness: 0.1, // Slight roughness on the clearcoat for realistic shine
    });
    
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.rotation.y = 0; // Reset any previous Y-axis rotation
    plate.rotation.x = 0; // Ensure no X-axis rotation    
    plate.position.set(0, 0, 0); // Center the plate
    scene.add(plate);

    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/Rubik_SemiBold_Regular.json", (font) => {
  // Use plate style properties (thickness, height, and fontSize) dynamically
  const textGeometry = new TextGeometry(plateNumber, {
    font,
    size: 2.8, // This controls the height of the letters (Y-axis)
    height: plateStyle.material.thickness==null?0:plateStyle.material.thickness/10, // This controls the extrusion depth (Z-axis thickness)
    curveSegments: 128, // Controls curve smoothness
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
    -textHeight / 2.2, // Center vertically based on text height
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
      
      // Dispose of the plate and text meshes if they exist
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    
      setTextMesh(null);
      setScene(null);
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
          plateMesh.material.emissive.set(0xffcd29)
        } else {
          plateMesh.material.color.set(0xffffff); // Lighter milk color for the front
          plateMesh.material.emissive.set(0xffffff)
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
          createHollowBorderShape((size.width-0.5) * scaleFactor, (size.height-0.5) * scaleFactor, 0.5, 0.15), {
            depth: border.material.thickness/10, // Depth of the border
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
    
      // Dispose of the old text mesh geometry and material
      if (textMesh.geometry) {
        textMesh.geometry.dispose();
      }
      if (textMesh.material) {
        if (Array.isArray(textMesh.material)) {
          textMesh.material.forEach((mat) => mat.dispose());
        } else {
          textMesh.material.dispose();
        }
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
      fontLoader.load("/fonts/Rubik_SemiBold_Regular.json", (font) => {
        if (!font) {
          console.error("Font loading failed");
          return;
        }
    
        // Create the base colored text geometry
        const textGeometry = new TextGeometry(plateNumber, {
          font,
          size: 2.8,
          height: plateStyle.material.thickness ? plateStyle.material.thickness / 20 : 0,
          curveSegments: 128,
        });
    
        // Create the thin black layer geometry
        const blackLayerGeometry = new TextGeometry(plateNumber, {
          font,
          size: 2.8,
          height: 0.1, // Very thin layer
          curveSegments: 128,
        });
    
        // Check if the plate style is GEL
        const isGelPlate = /GEL/i.test(plateStyle.name);
    
        // Assign material for GEL or default plates
        const textMaterial = isGelPlate
          ? new THREE.MeshBasicMaterial({
              color: 0x00ff00, // Green color
              emissive: 0x00ff00, // Glow effect
              emissiveIntensity: 1.5,
            })
          : new THREE.MeshBasicMaterial({ color: 0x000000 });
    
        textMesh.material = textMaterial; // Assign the material to the mesh
        textMesh.geometry = textGeometry; // Assign the geometry to the mesh
    
        // Handle Acrylic plates with a black layer
        const isAcrylicPlate = /ACRYLIC/i.test(plateStyle.name);
        let blackLayerMesh: THREE.Mesh | null = null;
    
        if (isAcrylicPlate) {
          blackLayerMesh = new THREE.Mesh(blackLayerGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
          blackLayerMesh.position.set(0, 0, plateStyle.material.thickness ? plateStyle.material.thickness / 20 + 0.1 : 0.1);
          blackLayerMesh.name = "blackLayerMesh";
          scene.add(blackLayerMesh); // Add black layer to the scene
        }
    
        // Centering and scaling logic
        textGeometry.computeBoundingBox();
        if (textGeometry.boundingBox) {
          let textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x || 0;
          let textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y || 0;
    
          console.log("Text dimensions:", textWidth, textHeight);
    
          // Ensure text fits within the plate
          const plateWidth = size.width * 0.7;
          const plateHeight = size.height * 0.7;
    
          if (textWidth > plateWidth) {
            const scaleFactor = plateWidth / textWidth;
            textMesh.scale.set(scaleFactor, scaleFactor, 1);
            if (blackLayerMesh) {
              blackLayerMesh.scale.set(scaleFactor, scaleFactor, 1);
            }
    
            // Recompute bounding box after scaling
            textGeometry.computeBoundingBox();
            textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x || 0;
            textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y || 0;
          }
    
          // Center text and black layer
          const offsetX = -textWidth / 2.2;
          const offsetY = -textHeight / 2.2;
    
          textMesh.position.set(offsetX, offsetY, 0.2); // Text position
          if (blackLayerMesh) {
            blackLayerMesh.position.set(offsetX, offsetY, plateStyle.material.thickness ? plateStyle.material.thickness / 20 + 0.24 : 0.24);
          }
        } else {
          console.warn("Bounding box calculation failed for text geometry.");
        }
      });
    }
    
        
  }, [scene, size, plateNumber, plateStyle, textMesh, border, isRear]); // Add isRear to dependency array
  

  return <div ref={mountRef} style={{ backgroundColor:'white',width: "100%", height: "100%" }} />;
};

export default ThreeDRectangle;
