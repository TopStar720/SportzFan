export function getFromDto<T>(dto: any, data: any, fields?: string[]): T {
  let properties: string[];
  if (fields && fields.length) {
    properties = fields;
  } else {
    properties = Object.keys(dto);
  }
  properties.forEach((property) => {
    data[property] = dto[property];
  });
  return data;
}

export function getDistanceBetweenPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  // The radius of the planet earth in meters
  const R = 6378137;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLong = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat1)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
