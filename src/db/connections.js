const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connection successful with mongodb....");
    })
    .catch((e) => {
        console.log(e);

    });


