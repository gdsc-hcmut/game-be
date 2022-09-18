import { inject, injectable } from 'inversify';
import { MongoClient, Db } from 'mongodb';
import { DB_CONN_STRING, DB_NAME } from '../config';
import mongoose, { Mongoose } from 'mongoose';

@injectable()
export class DatabaseService {
    private client: Mongoose;
    private _db: Db;

    constructor() {
        console.log('[Database service] Construct');
    }

    async initialize() {
        console.log(
            '[DB] Prepare to connect db with connection string:',
            DB_CONN_STRING,
        );

        try {
            mongoose.connect(DB_CONN_STRING, () => {
                console.log('connected to mongodb');
            });
        } catch (error) {
            console.log(error);
        }
    }

    get db(): Db {
        return this._db;
    }
}
