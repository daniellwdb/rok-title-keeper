export const rgbToHex = (r: number, g: number, b: number) => {
  const componentToHex = (colourComponent: number) => {
    const hex = colourComponent.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
  };

  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
