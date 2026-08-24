export const hasCoordinates = (latitude, longitude) => (
  Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))
);
