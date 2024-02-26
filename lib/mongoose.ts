import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) {
        console.error('MONGODB_URL is missing');
    }

    if(isConnected) {
        return console.log('using existing database connection');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: 'devflow'
        });

        isConnected = true;
        console.log('new database connection');
    } catch (error) {
        console.error('error connecting to database');
    }

}