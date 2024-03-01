import mongoose from 'mongoose';

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) {
        console.error('MONGODB_URL is missing');
    }

    try {
        const mongodbUrl = process.env.MONGODB_URL!; 
        await mongoose.connect(mongodbUrl, {
            dbName: 'devflow'
        });

        console.log('new database connection');
    } catch (error) {
        console.error('error connecting to database');
    }

}