const mongoose = require("mongoose");
const url = "mongodb+srv://my_reg:7fzH0uyBM5fpkIzf@atlascluster.av8qw1n.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url)
    .then(() => {
        console.log("connection successful with mongodb....");
    })
    .catch((e) => {
        console.log(e);

    });


