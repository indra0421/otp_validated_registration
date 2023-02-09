const express = require("express");
const app = express();
const port = 4500;
const config = require("./config");

const client = require("twilio")(config.accountSid, config.authToken);


app.get('/login', (req, res) => {
    client
        .verify.v2
        .services(config.verifySid)
        .verifications
        .create({
            to: `+${req.query.phone}`,
            channel: req.query.channel    //can be selected as call email sms anything
        })
        .then((data) => {
            res.status(200).send(data);
            console.log('verification succesfull');
        })

})
//verifying the code received through sms
app.get('/verify', (req, res) => {
    client
        .verify
        .services(config.verifySid)
        .verificationChecks
        .create({
            to: `+${req.query.phone}`,
            code: req.query.code
        })
        .then((data) => {
            res.status(200).send(data);
        })
})



app.listen(port, () => {
    console.log(`server is listening at port ${port}`)
})