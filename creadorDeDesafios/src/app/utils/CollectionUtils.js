export const replace = (elements, elementToReplace, elementToReplaceItWith) => {
  return elements.map((element, index) => {
    const isElementToReplace = elements.indexOf(elementToReplace) === index;
    return isElementToReplace ? elementToReplaceItWith : element;
  });
};