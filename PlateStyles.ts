// Types for plate styles
export interface PlateStyleOption {
  name: string; // Name of the plate style
  letters: number[]; // Number of letters allowed for the plate
  frontSizes: string[]; // Available front size options (e.g., '18"', 'Standard 20.5"')
  rearSizes: string[]; // Available rear size options (e.g., '18"', 'Square 11" x 8"')
  border: string; // Description of the border style (e.g., 'Printed', '4D Acrylic')
  thickness: number; // Plate material thickness (in mm)
  height: number; // Text extrusion depth (in mm)
  fontSize: number; // Text font size
  colors?: string[]; // Available colors for neon plates (optional)
  additionalDetails?: string; // Any extra details (optional)
}

  
  const plateStyles: PlateStyleOption[] = [
    {
      name: '4D 3mm Acrylic',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 3mm Acrylic',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D 5mm Acrylic',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 5mm Acrylic',
      thickness: 5, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '3D Gel',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 3D Gel',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D 3mm Acrylic and Gel',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 3mm Acrylic and Gel',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D 5mm Acrylic and Gel',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 5mm Acrylic and Gel',
      thickness: 5, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D 5mm Gel',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 5mm Gel',
      thickness: 5, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: 'Printed',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D Neon Acrylic',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 3mm Acrylic',
      colors: ['Black on Red', 'Black on Blue', 'Black on Green'],
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: '4D Neon Acrylic and Gel',
      letters: [7],
      frontSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"'],
      rearSizes: ['18"', 'Standard 20.5"', 'Hex 20.5"', 'Square 11" x 8"'],
      border: 'Printed - 4D 3mm Acrylic',
      colors: ['Black on Red', 'Black on Blue', 'Black on Green'],
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: 'Bubble Plates',
      letters: [7],
      frontSizes: ['Custom'],
      rearSizes: ['Custom Standard', 'Custom Square'],
      additionalDetails: 'Gel only (NO PREVIEW AVAILABLE)',
      border: 'Unavailable',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: 'Motorbike Plates Printed',
      letters: [7],
      frontSizes: ['9" x 7"'],
      rearSizes: ['9" x 7"'],
      border: 'Printed',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    },
    {
      name: 'Motorbike Plates 4D Acrylic',
      letters: [7],
      frontSizes: ['9" x 7"'],
      rearSizes: ['9" x 7"'],
      border: '4D Acrylic - Printed',
      thickness: 3, // Plate material thickness in mm
      height: 0.4,  // Text extrusion depth in mm
      fontSize: 3,  // Text font size
    }
  ];
    
  // Helper function to filter styles by number of letters
  function getStylesByLetterCount(letterCount: number) {
    return plateStyles.filter(style => style.letters.includes(letterCount));
  }
  
  export { plateStyles, getStylesByLetterCount };