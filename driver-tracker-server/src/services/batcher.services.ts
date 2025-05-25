import { DriverLocationUpdate } from "../interfaces/DriverLocationUpdate";
import * as DriverLocationServices from "./driver-location.services";

const buffer: DriverLocationUpdate[] = [];
const FLUSH_INTERVAL_MS = 100;

export function initBatching() {
  setInterval(flushBuffer, FLUSH_INTERVAL_MS);
}

export function addToBatch(update: DriverLocationUpdate) {
  buffer.push(update);
}

async function flushBuffer() {
  if (buffer.length === 0) return;

  const updates = [...buffer];
  buffer.length = 0;
  try {
    await DriverLocationServices.batchUpdateDriverLocation(updates);
    console.log(`Flushed ${updates.length} updates on ${updates.length} current drivers location`);
  } catch (err) {
    console.error("Error during batch flush:", (err as Error).message);
  }
}