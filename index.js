const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config();

const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//to see the form data in browser and getting the form data we have to use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./src/db/connections");

const { json } = require("express");
app.use(express.json());
const hbs = require("hbs");
const port = process.env.PORT || 4500;

const Register = require("./src/models/employees");

const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));

const template_path = path.join(__dirname, "./templates/views");
const partial_path = path.join(__dirname, "./templates/views");

app.set("view engine", "hbs");
app.set('views', template_path);
hbs.registerPartials(partial_path);

app.get("/",(req,res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register");

})

app.get('/send/:mobile', (req, res) => {
    const mob = req.params.mobile;
    // console.log(mob);

    client
        .verify.v2
        .services(process.env.VERIFY_SID)
        .verifications
        .create({
            to: `+${mob}`,
            channel: "sms"
        })
        .then((data) => {
            res.status(200).send(data);
            // res.render("register");
            // console.log('verification succesfull');
        }).catch((e) => {
            res.send(e);
        })

})

app.get('/verify/:userOtp/:mobile', (req, res) => {

    const typedOtp = req.params.userOtp;
    const mob = req.params.mobile;

    client
        .verify
        .services(process.env.VERIFY_SID)
        .verificationChecks
        .create({
            to: `+${mob}`,
            code: typedOtp
        })
        .then((data) => {
            res.status(200).json({ val: data.status });

        })
        .catch((e) => {
            res.send(e);
        })
})


app.post("/register", async (req, res) => {
    try {
        // const mob = `+${req.body.mobile}`;
        const currentTime = new Date().toLocaleString();
        const timeStr = currentTime;
        const registerEmployees = new Register({
            fullname: req.body.fullname,
            company: req.body.company,
            purpose: req.body.purpose,
            entry: timeStr,
            mobile: req.body.mobile
        })
        const registeredData = await registerEmployees.save();
        // console.log(registeredData);
        res.status(201).send(registeredData);


        //sending token to the client
        const token = Math.random().toString(36).slice(2);

        client.messages
            .create({
                body: `Your confirmation token is: ${token}`,
                from: '+15733076712',
                //only for verified members set in the twilio service
                //to add number , first add to twilio Verified Caller IDs
                to: `+${req.body.mobile}`,
                
                
            })
            .then(message => console.log(message))
            .catch(err => {
                console.error(err);
                res.status(500).send('Error sending SMS message');
            })
            


    } catch (e) {
        res.status(400).send(e);
    }
})


app.listen(process.env.PORT || 4500, () => {
    console.log(`connection is setup at port ${port}`);
})

