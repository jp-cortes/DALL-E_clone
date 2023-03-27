import mongoose from 'mongoose';

function connectDB(url) {
    mongoose.set('strictQuery', true);
    mongoose.connect(url)
    .then(() => console.log('connected to mongo'))
    .catch((error) => {
        console.error('failed to connect mongo');
        console.error(error);
    });
}
export { connectDB };