import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { DriverLocation, DriverLocationRequest } from './interfaces/DriverLocation';

dotenv.config();

const CHECK_INTERVAL_MS = 5000;
const TARGET_FOLDER = path.resolve(__dirname, 'input');
const PROCESSED_FOLDER = path.resolve(__dirname, 'processed');

function scheduleUpdates(updates: DriverLocation[]) {
  const startTime = Date.now();

  updates.forEach(update => {
    const delay = update.time_offset_sec * 1000;

    setTimeout(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] Sending update for ${update.driver_id}`);
        //TODO: API call
        const requestStart = Date.now();
        const payload: DriverLocationRequest = {
            driver_id: update.driver_id,
            latitude: update.latitude,
            longitude: update.longitude
        }
        axios.post(`${process.env.API_SERVER_URI}/drivers/location`, payload)
        .then(()=>{
            const elapsedMs = Date.now() - requestStart;
            console.log(`[${elapsedMs}ms] sent update for ${payload.driver_id}`)}
        ).catch((err)=>{
            const elapsedMs = Date.now() - requestStart;
            console.log(`[${elapsedMs}ms] error sending update for ${payload.driver_id}`, err.message)
        })
    }, delay);
  });
}


function start_data_feed(){
    if (!fs.existsSync(TARGET_FOLDER)) {
        fs.mkdirSync(TARGET_FOLDER);
    }
    if (!fs.existsSync(PROCESSED_FOLDER)) {
        fs.mkdirSync(PROCESSED_FOLDER);
    }

    setInterval(() => {
        fs.readdir(TARGET_FOLDER, (err, files) => {
        if (err) {
            console.error(`Failed to read folder: ${err.message}`);
            return;
        }

        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log('No file to be process.');
            return;
        }

        jsonFiles.forEach(file => {
            const filePath = path.join(TARGET_FOLDER, file);

            fs.readFile(filePath, 'utf-8', async (err, content) => {
            if (err) {
                console.error(`Failed to read file ${file}: ${err.message}`);
                return;
            }

            try {
                const parseStart = Date.now()
                const updates: DriverLocation[] = await JSON.parse(content);
                const parseElapsed = Date.now() - parseStart;

                console.log(`file finished parsed in ${parseElapsed}ms`)
                scheduleUpdates(updates);

                // Move file to processed
                const processedPath = path.join(PROCESSED_FOLDER, file);
                fs.rename(filePath, processedPath, err => {
                if (err) {
                    console.error(`Failed to move file ${file} to processed: ${err.message}`);
                } else {
                    console.log(`✔ File ${file} processed and moved.`);
                }
                });
            } catch (e: any) {
                console.error(`Invalid JSON in file ${file}: ${e.message}`);
            }
            });
        });
        });
  }, CHECK_INTERVAL_MS);
}

start_data_feed();