type Coordinates = [number, number];

type Geometry = {
  type: string;
  coordinates: Coordinates[][];
};

type Feature = {
  type: string;
  properties: Record<string, any>;
  geometry: Geometry;
};

export type GeoJSONO = {
  type: string;
  features: Feature[];
};
