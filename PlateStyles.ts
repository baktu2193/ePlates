export interface PlateSize {
  key:string;
  width:number;
  height:number;
}

export interface Material {
  type: string;
  thickness: number | null;
}

export interface Border {
  name: string;
  type: string | null;
  material: Material | null;
}

export interface Plate {
  letters: number;
  name: string;
  material: Material;
  colour?: string[];
  frontPlate: {
    sizes: PlateSize[];
  };
  rearPlate: {
    sizes: PlateSize[];
  };
  border: Border;
  preview: boolean;
}
  
const plateStyles: Plate[] = [
  {
    letters: 7,
    name: '4D 3mm Acrylic',
    material: { type: '4D Acrylic', thickness: 3 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 3mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 3 } },
    preview: true
  },
  {
    letters: 7,
    name: '4D 5mm Acrylic',
    material: { type: '4D Acrylic', thickness: 5 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 5mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 5 } },
    preview: true
  },
  {
    letters: 7,
    name: '3D Gel',
    material: { type: 'Gel', thickness: null },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 3mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 3 } },
    preview: false
  },
  {
    letters: 7,
    name: '4D 3mm Acrylic and Gel',
    material: { type: '4D Acrylic and Gel', thickness: 3 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 3mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 3 } },
    preview: true
  },
  {
    letters: 7,
    name: '4D 5mm Acrylic and Gel',
    material: { type: '4D Acrylic and Gel', thickness: 5 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 3mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 3 } },
    preview: false
  },
  {
    letters: 7,
    name: '4D 5mm Gel',
    material: { type: 'Gel', thickness: 5 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '4D 5mm Acrylic', type: 'Printed', material: { type: '4D Acrylic', thickness: 5 } },
    preview: true
  },
  {
    letters: 7,
    name: '5D 5mm Acrylic',
    material: { type: '5D Acrylic', thickness: 5 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '5D 5mm Acrylic', type: 'Printed', material: { type: '5D Acrylic', thickness: 5 } },
    preview: false
  },
  {
    letters: 7,
    name: '6D 6mm Acrylic',
    material: { type: '6D Acrylic', thickness: 6 },
    frontPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 }
      ]
    },
    rearPlate: {
      sizes: [
        { key: 'standard', width: 18, height: 18 },
        { key: 'hex', width: 20.5, height: 20.5 },
        { key: 'square', width: 20.5, height: 20.5 }
      ]
    },
    border: { name: '6D 6mm Acrylic', type: 'Printed', material: { type: '6D Acrylic', thickness: 6 } },
    preview: true
  }
];

   
  // Helper function to filter styles by number of letters
  function getStylesByLetterCount(letterCount: number) {
    return plateStyles.filter(style => style.letters==(letterCount));
  }
  
  export { plateStyles, getStylesByLetterCount };