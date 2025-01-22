import { Db, MongoClient } from 'mongodb';

let cachedClient: MongoClient;
let cachedDb: Db;

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Using cached client and db...');
		}
		return { client: cachedClient, db: cachedDb };
	}
	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI environment variable is not defined');
	}

	const client = new MongoClient(process.env.MONGODB_URI as string);
	await client.connect(); // Connect to the MongoDB client
	const db = client.db(); // Get the database

	cachedClient = client;
	cachedDb = db;
	return { client, db };
}