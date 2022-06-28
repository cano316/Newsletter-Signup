const express = require('express');
const app = express();
const axios = require('axios').default;
require('dotenv').config();
// Serve static files
app.use(express.static("public"))
// Parser
app.use(express.urlencoded({ extended: true }));

// Paths
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const { firstname, lastname, email } = req.body;
    // Per Mailchimp Documentation, this is how they want data passed into
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    // SEND FORM DATA TO MAILCHIMP FUNCTION
    postToMailChimp(data);
    // POST TO MAILCHIMP, USING ASYNC FUNCTION
    async function postToMailChimp(data) {
        const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}`;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `api_key ${process.env.MAILCHIMP_API_KEY}`
            }
        }
        try {
            const response = await axios.post(url, data, options);
            // console.log(response.config.data)
            res.sendFile(__dirname + '/success.html')
        } catch (error) {
            res.sendFile(__dirname + '/failure.html')
            // console.log(error.response.data)
        }
    }
})

app.listen(process.env.PORT || 3000, function () {
    console.log('LISTENING ON PORT 3000')
})
