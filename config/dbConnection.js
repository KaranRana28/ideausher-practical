const mongoose = require('mongoose');
const { set } = require('mongoose');
const uri = process.env.DB_URL;

module.exports = () => {
    mongoose.connect(uri)
        .then(() => {
            /** Enable below code if you want to see mongo query logs */
            set('debug', false)
            console.log("MongoDB URI: ", uri);
            console.log("MongoDB Status: Database Connected Successfully");
            console.log("**************************************************");
        })
        .catch((error) => {
            console.log("MongoDB URI: ", uri);
            console.log("MongoDB Status: Error While Connecting Mongodb: ", error.message);
            console.log("**************************************************");
        });

    mongoose.connection.on('disconnected', () => console.log('disconnected'));
    mongoose.connection.on('reconnected', () => console.log('reconnected'));
}