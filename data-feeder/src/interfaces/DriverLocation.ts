export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  time_offset_sec: number;
}

export type DriverLocationRequest = Pick<DriverLocation, "driver_id" | "latitude" | "longitude">