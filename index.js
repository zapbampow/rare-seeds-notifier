require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioNum = process.env.TWILIO_NUMBER;
const sendNum = process.env.SEND_PHONE;

const { messageAlreadySent, updateSentState, logAttempt } = require('./firebase');

// Handles whether to send a message based on whether one has already been sent
async function sendMessageDecider() {
  const sentState = await messageAlreadySent();

  if(!sentState) {
    client.messages
    .create({
      body: "Black pepper vines are in stock at Rare Seeds",
      from: twilioNum,
      to: sendNum
    })
    .then(message => {
      updateSentState(true);
      console.log(message.sid);
      return;
    })
    .then(res => {
      logAttempt();
    });
  } else {
    console.log(" Available, but message already sent");
    logAttempt();
  }
}


// GETS AVAILABILITY FROM RARE SEEDS PAGE AND CONDITIONALLY SENDS MESSAGE ABOUT AVAILABILITY
request("https://www.rareseeds.com/store/vegetables/live-plants/pepper-black-2-plants-march-may-ships-prompt-weekly-as-available", 
// request("https://www.rareseeds.com/store/vegetables/live-plants/fig-olympian-2-plants-march-may-ships-prompt-weekly-as-available",
(error, response, html) => {
  if(error) {
    console.log(error);
  } else if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const availability = $(".stock").children().last().text();
    const available = availability.toLowerCase() === "in stock";

    if(available) {
      sendMessageDecider();
    } else {
      console.log('Still unavailable');
      logAttempt();
    }

  }
})