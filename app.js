const fs = require('fs')
let raw = fs.readFileSync('database.json')
let faqs = JSON.parse(raw)
const { App } = require('@slack/bolt')
require('dotenv').config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
})

app.command('/knowledge', async ({ command, ack, say }) => {
  try {
    await ack()
    let message = { blocks: [] }
    faqs.data.map((faq) => {
      message.blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Question*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.question,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Answer*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: faq.answer,
          },
        }
      )
    })
    say(message)
  } catch (error) {
    console.log('err')
    console.error(error)
  }
})

;(async () => {
  const port = 3000
  await app.start(process.env.PORT || port)
  console.log(`Slack Bolt app is running on port ${port}!`)
})()
