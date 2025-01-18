import {Redis} from "@upstash/redis";
// for local development
const redis = Redis.fromEnv();

console.log("Redis connected");

export default redis;
