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


//Test code for groups and emails for DASHBOARD
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



//Test code for feedback BOTTOMSHEET
app.post('/feedback', function (req,res){
  let feedback = req.body;
  feedback.feedbackID = crypto.randomUUID({disableEntropyCache:true});
  let feedbacks = JSON.parse(fs.readFileSync('feedbacks.json','utf-8'));
  feedbacks.push(feedback);
  let data = JSON.stringify(feedbacks);
  fs.writeFileSync('feedbacks.json',data);
  res.end();
});



//Test code for chart BOTTOMSHEET
app.get('/occupancy',function(req,res){
  let start = req.query.start;
  let end = req.query.end;
  let lotName = req.query.lotName;
  let lotconfhis = JSON.parse(fs.readFileSync('lotconfhis.json','utf-8'));
  let times = Object.keys(lotconfhis);
  let range = [];
  for(t of times){
    if(start>t){
      continue;
    }
    if(t>end){
      continue;
    }
    if(Object.keys(lotconfhis[t])[0] != lotName){
      continue;
    }
    range.push({info: lotconfhis[t][lotName], time: t});
  }

  res.send(range);
  //Date(key*1000) -> correct day and time
  //time created is key
  //looks like
  // lotname, lot_cap, max_occup, num_parked, num_parked_android, num_parked_ios
});


app.listen(port, () => console.log(`Running local server on port ${port}!`));
