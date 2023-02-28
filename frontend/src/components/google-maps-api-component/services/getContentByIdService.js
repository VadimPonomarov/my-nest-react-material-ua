export const getContentByIdService = (marker, infoWindowArray) => {
  const isFound = infoWindowArray
    .find(item => item.id === marker.id);
  if (!isFound) return;
  return isFound.content;
}