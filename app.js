const { App } = require('@slack/bolt')
require('dotenv').config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
})

app.event('message', async ({ event, logger, say }) => {
  try {
    if (event.text.toLowerCase() === 'inha') {
      const user = await app.client.users.info({ user: event.user })
      say({
        text: 'Slack',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${user.user.real_name} отгадал слово "inha"`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Хочу быть ведущим!',
                },
              },
            ],
          },
        ],
      })
    }
  } catch (error) {
    logger.error(error)
  }
})

app.command('/start', async ({ command, ack, say, logger }) => {
  try {
    const user = await app.client.users.info({ user: command.user_id })
    await ack()
    say({
      text: 'Slack',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${user.user.real_name} - объясняет слово!`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Посмотреть слово',
              },
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Слово',
                },
                text: {
                  type: 'mrkdwn',
                  text: 'INHA',
                },
                confirm: {
                  type: 'plain_text',
                  text: 'Окей',
                },
                deny: {
                  type: 'plain_text',
                  text: 'Закрыть',
                },
              },
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Новое слово',
              },
              style: 'primary',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'Новое слово',
                },
                text: {
                  type: 'mrkdwn',
                  text: 'NEW INHA',
                },
                confirm: {
                  type: 'plain_text',
                  text: 'Окей',
                },
                deny: {
                  type: 'plain_text',
                  text: 'Закрыть',
                },
              },
            },
          ],
        },
      ],
    })
  } catch (error) {
    logger.error(error)
  }
})
;(async () => {
  const port = 3000
  await app.start(process.env.PORT || port)
  console.log(`Slack Bolt app is running on port ${port}!`)
})()
