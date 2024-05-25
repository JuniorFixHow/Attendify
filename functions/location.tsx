export function calculateDistance(
  laptopLatitude: number,
  laptopLongitude: number,
  phoneLatitude: number,
  phoneLongitude: number,
): number {
  const earthRadius = 6371000; // Radius of the Earth in meters

  const lat1 = toRadians(laptopLatitude);
  const lon1 = toRadians(laptopLongitude);

  const lat2 = toRadians(phoneLatitude);
  const lon2 = toRadians(phoneLongitude);

  const deltaLat = lat2 - lat1;
  const deltaLon = lon2 - lon1;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}