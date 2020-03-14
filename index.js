require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioNum = process.env.TWILIO_NUMBER;
const sendNum = process.env.SEND_PHONE;

// request("https://www.rareseeds.com/store/vegetables/live-plants/fig-olympian-2-plants-march-may-ships-prompt-weekly-as-available",
request("https://www.rareseeds.com/store/vegetables/live-plants/pepper-black-2-plants-march-may-ships-prompt-weekly-as-available", 
(error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const availability = $(".stock").children().last().text();
    const available = availability.toLowerCase() === "in stock";

    if(available) {
      client.messages
        .create({
          body: "Black pepper vines are in stock = " + availability,
          from: twilioNum,
          to: sendNumn
        })
        .then(message => console.log(message.sid));
    } else {
      console.log("Not in stock")
    }
  }
})