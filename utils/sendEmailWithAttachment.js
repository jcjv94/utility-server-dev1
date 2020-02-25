const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const emailDebugger = require("debug")("app:email");

// const img = require('../images/ADN_animation.gif');

sendEmailWithAttachment = async data => {
  console.log("sendEmailWithAttachment data:", data);
  let toEmail = data.toEmail;
  let fromEmail = data.replyTo;
  console.log("fromEmail:", fromEmail);
  var outcome = true;

  emailDebugger("htmlLink" + data.htmlLink + " toEMail:" + data.toEmail);
  var transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: keys.emailID,
      pass: keys.emailPassKey
    }
  });


  let fileObj = {};
  if (data.filename) {
    fileObj = {
      filename: data.filename.replace(/^.*[\\\/]/, ""),
      path: data.s3url,
      cid: "welcome"
    };
  } else {
    fileObj = {
      filename: "dna.jpg",
      path: __dirname + "/dna.jpg",
      cid: "welcome"
    };
  }

  console.log('fileObj:', fileObj);

  var mailOptions = {
    from: keys.emailID,
    to: toEmail,
    replyTo: fromEmail,
    subject: data.subject,
    text: "Welcome to Baanda!!",
    html: data.htmlLink,
    attachments: [
      // {
      //   filename: "dna.jpg",
      //   path: __dirname + "/dna.jpg",
      //   cid: "welcome"
      // },
      fileObj,
      {
        filename: "baandalogo.png",
        path: __dirname + "/baandalogo.png",
        cid: "baandalogo"
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sendmail : " + error);
      outcome = false;
    } else {
      console.log("Message %s sent: %s ", info.messageId, info.response);
    }
  });

  return outcome;
};

module.exports = sendEmailWithAttachment;
