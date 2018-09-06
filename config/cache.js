import mongoose from 'mongoose';
import redis from 'redis';
import util from 'util';

const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    //See if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    //If we do return that
    if (cacheValue) {
        const doc = new this.model(JSON.parse(cacheValue));
       return JSON.parse(cacheValue);
    }

    //Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);
    const check = client.set(key, JSON.stringify(result), (err, res) =>{
        if(err) throw err;
        
    });
    
    return result;
};