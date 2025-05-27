# Splyt-Software-Dev-Interview-Task
Driver location tracking app. Driver's location data ingested via script that calls api from server. Data is stored in an unstructured db and presented via api call from the same server.

## Requirement
1. Node.JS prefereably v20+
2. Docker

## Installation
### Setting up MongoDB
Open up terminal and type in
```bash
cd mongo-db-server
```
Ensure docker is running. We will start an instance of MongoDB by running
```bash
docker-compose up
```
A MongoDB instance will run on port 27017 with default user `root` and password `example`. You can adjust the credential as needed from `docker-compose.yml` as needed.
<br/>
Mongo-express instance is also booted up. You can go to `localhost:8081` in browser and verify the db is up.
<br>
Or alternatively, you can install mongodb app and use other client such as compass to navigate. What matters is we get the connection string for the application to read and write to the db.

---
### Setting up Server API
Server API is used to read and write driver's location data into MongoDB.
<br>Open a terminal and type in
```bash
cd driver-tracker-server
```
Once in, run this command to install the application.
```bash
npm install
```
To start the server, run command
```bash
npm run dev
```
Server will start on port `3000` denoted in the .env file in the folder. All the variable in the .env files serve as sample value to simplify installation.
<br>
**Some quirks:**
<br>1. Swagger is used to document the api. You can go to `http://localhost:3000/api-docs/` in your browser to access it.
<br>2. Initial api token `data-feeder-splyt` is created upon server start up. This token is needed to post or upload data on the `/location` route.
<br>3. Initial user account is created upon server start up. `splyt-admin:splyt-admin123`. This user is required to generate, query, and revoke api token.

---
### Setting up data feeder
Data feeder is used to automate the process of pushing data trough the server's API endpoint.
<br> Open up terminal and type
```bash
cd data-feeder
```
Once in, run this command to install the application:
```bash
npm install
```
Once finished, you can run this command to start the app
```bash
npm run dev
```
**Some quirks:**
<br>1. Data-feeder will watch and process any .json file in the `src/input/` directory. This means the app will keep on running until terminated and you can just paste json file inside the folder.
<br>2. Processed file will be then put in `src/processed/` directory.

---
## Observation On The Task
1. I've chosen to use docker to boot up instance of MongoDB as the idea is I don't want to go to the process of installing application. Plus, with docker I can just destroy the instance and remove the volume and start fresh quickly.
<br><br>

2. I've chosen to use 2 collections to represent the driver's location.
<br>**currentlocations**:
<br>This collection simply holds the latest location of the driver. index applied on `driverId` as it'll be the main field to query.
<br>**locationledgers**:
This collection holds all the updates provided by data-feeder, presented in a ledger style. This will be useful for historical purpose. 
<br>The reason separating this from the currentlocation (as opposed to embed it) is so that data are queried as minimal as possible. 1 document per insertion is to allow pagination, for the same reason.
<br><br>

3. `/locations` post route is guarded by API token, which is used by the data-feeder application. 
<br> The reason is because server api will receive frequent update from data-feeder, however we would still need to guard the route from explicit update.
<br> the API token can be revoked via logged in user with the valid JWT token.
<br><br>

4. Initially, I let 1 request, 1 insertion (insertOne) to db as it seems logical to do so. 
<br>Upon test with the provided dataset, I see the first 10 request (fired together on offset 0) took roughly `300ms~` before going sub `60ms~` for the subsequence request.
<br><br>Then, I ramped up the dataset to use 100 drivers update. Which then I saw a huge degradation in performance. Some went up to 12-30 seconds and some even hit connection reset. It was at this point I learned that every write to MongoDB will require acknowledgment which will become bottleneck the more request coming.
<br><br>

5. It was then I decided to batch the write instead. Due to the frequency of data update, it seems logical to do so. All request payload will be put into a queue and responded with acknowledgement. queue will be then inserted to **MongoDB** via `insertMany` and `BulkWrite` instead.
<br> Update were fast. First request would take around 100ms~ which I suspect is due to inital server not warming up. However, the subsequent request would take just around `11ms~`. The server was able to handle at least a 100 request/sec.
<br>However, the trade-off is the update would have latency around 100ms as I deliberately clear up the pending queue every 100ms.
<br><br>

6. Any time a request hit the server, I will assign a timestamp to it before putting it in the queue. This helps with the update chronology. For example, if 2 updates for the same driver_id happened to be in the same queue. We will take the latest timestamp to update the current location.
<br><br>

7. This was a fun task to do and look up from perspective on how to write application at scale.
<br> Further improvement that I can think of is to try nodeJs `cluster` mode to deploy multiple instance of nodeJs and a load balancer in front of them. This is due to how nodeJs is running on a single core (single threaded).
<br> Another improvement I would like to try is also playing around with mongodb connection's pooling.

8. Some article that I read during the task to get inspiration.
<br>[Scaling one million checkboxes](https://eieio.games/blog/scaling-one-million-checkboxes/)
<br>[50 million records insert in mongodb using nodeJs](https://medium.com/shelf-io-engineering/50-million-records-insert-in-mongodb-using-node-js-5c62b7d7af5a)