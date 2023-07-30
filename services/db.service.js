import mongoose from "mongoose";

export const conectarBaseDatos = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const uri = 'mongodb+srv://pruebasradiussnet:admin123@cluster0.fhcf9jq.mongodb.net/radiussnet?retryWrites=true&w=majority';
            const db = await mongoose.connect(uri);

            console.log('MongoDB radiussnet')
            resolve(db);
        } catch (error) {
            console.log('MongoDB radiussnet connection error')
            console.log(error);

            reject({
                msg: 'MongoDB connection error',
                error
            });
        } 
    });
}