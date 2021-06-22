const { MAILJET_KEY1, MAILJET_KEY2 } = require('../constants')

const mailjet = require('node-mailjet').connect(MAILJET_KEY1, MAILJET_KEY2)

exports.sendMail = async (email, subject, textPart, htmlPart, customId) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'olga.donchenko.art@gmail.com',
          Name: 'Olga Donchenko',
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: subject,
        TextPart: textPart,
        HTMLPart: htmlPart,
        CustomID: customId,
      },
    ],
  })

  request
    .then((result) => {
      console.log('Email succefully sent')
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
}
