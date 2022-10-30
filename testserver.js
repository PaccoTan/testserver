const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'support@parkzenapp.com',
      pass: 'yrihkexroeoyumvs'
    }
});

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/forward-email', (req, res) => {
    //Code for email related things
    let emailData = req.body;
    var mailOptions = {
      from: 'support@parkzenapp.com',
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.description
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
});

app.post('/feedback', function (req,res){
  let feedback = req.body;
  feedback.feedbackID = crypto.randomUUID({disableEntropyCache:true});
  let feedbacks = JSON.parse(fs.readFileSync('feedbacks.json','utf-8'));
  feedbacks.push(feedback);
  let data = JSON.stringify(feedbacks);
  fs.writeFileSync('feedbacks.json',data);
  res.end();
});

app.post('/group-feedback', function (req, res){
    let group = req.body;
    let groups = JSON.parse(fs.readFileSync('groups.json','utf-8'));
    groups.push(group)
    let data = JSON.stringify(groups);
    fs.writeFileSync('groups.json', data);
    res.end();
});

app.get('/group-feedback', function (req, res){
    let groups = fs.readFileSync('groups.json','utf-8');
    res.send(groups);
});

app.get('/groupid', function (req, res){
    let groupID = crypto.randomUUID({disableEntropyCache : true});
    res.send(groupID)
});

app.listen(port, () => console.log(`Running local server on port ${port}!`));
