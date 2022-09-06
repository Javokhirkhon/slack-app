import pkg from '@slack/bolt'
import mongodb from './mongodb-client.js'
import axios from 'axios'

const { App } = pkg
const app = new App({
  token: 'xoxb-3922927625767-3937400990931-mGjmf7cMIYUXVAdxApkKZZjC',
  signingSecret: 'e1f4f67d13889a02b224ccd3e0041c96',
  socketMode: true,
  appToken:
    'xapp-1-A03U95YQMK2-3930906532502-a99211cde0713b06849dfb28c91e2c5b2ce9a3f5a4681ff44f12cd3c1786e1e6',
})

;(async () => {
  const port = 3000
  await app.start(port)
  const client = await mongodb
  const collection = await client.db('slack-app').collection('crocodile-game')

  app.command('/describe', async ({ command, ack, say, logger }) => {
    try {
      await axios
        .get('https://random-word-api.herokuapp.com/word')
        .then(async (response) => {
          await collection.updateOne(
            { master: command.user_id, channel: command.channel_id },
            {
              $set: {
                master: command.user_id,
                channel: command.channel_id,
                word: response.data[0],
              },
            },
            { upsert: true }
          )

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
            ],
          })
          try {
            await app.client.chat.postEphemeral({
              channel: command.channel_id,
              user: command.user_id,
              text: 'Slack',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `Слово :ghost: *${response.data[0]}*`,
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
                        text: 'Изменить слово!',
                      },
                      value: 'refresh',
                      action_id: 'refresh',
                    },
                  ],
                },
              ],
            })
          } catch (error) {
            logger.error(error)
          }
        })
        .catch((error) => console.log(error))
    } catch (error) {
      logger.error(error)
    }
  })

  app.event('message', async ({ event, logger, say }) => {
    const { word, master } = await collection.findOne({
      channel: event.channel,
    })
    try {
      if (event.text.toLowerCase() === word && master !== event.user) {
        const user = await app.client.users.info({ user: event.user })
        await say({
          text: 'Slack',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${user.user.real_name} отгадал слово "${word}"`,
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
                  value: 'admin',
                  action_id: 'admin',
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

  app.action('admin', async ({ ack, say, body, logger }) => {
    try {
      await axios
        .get('https://random-word-api.herokuapp.com/word')
        .then(async (response) => {
          await collection.updateOne(
            { master: body.user.id, channel: body.channel.id },
            {
              $set: {
                master: body.user.id,
                channel: body.channel.id,
                word: response.data[0],
              },
            },
            { upsert: true }
          )

          const user = await app.client.users.info({ user: body.user.id })
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
            ],
          })
          try {
            await app.client.chat.postEphemeral({
              channel: body.channel.id,
              user: body.user.id,
              text: 'Slack',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `Слово :ghost: *${response.data[0]}*`,
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
                        text: 'Изменить слово!',
                      },
                      value: 'refresh',
                      action_id: 'refresh',
                    },
                  ],
                },
              ],
            })
          } catch (error) {
            logger.error(error)
          }
        })
        .catch((error) => console.log(error))
    } catch (error) {
      logger.error(error)
    }
  })

  app.action('refresh', async ({ ack, say, body, logger }) => {
    try {
      await axios
        .get('https://random-word-api.herokuapp.com/word')
        .then(async (response) => {
          await collection.updateOne(
            { master: body.user.id, channel: body.channel.id },
            {
              $set: {
                master: body.user.id,
                channel: body.channel.id,
                word: response.data[0],
              },
            },
            { upsert: true }
          )

          const user = await app.client.users.info({ user: body.user.id })
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
            ],
          })
          try {
            await app.client.chat.postEphemeral({
              channel: body.channel.id,
              user: body.user.id,
              text: 'Slack',
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `Слово :ghost: *${response.data[0]}*`,
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
                        text: 'Изменить слово!',
                      },
                      value: 'refresh',
                      action_id: 'refresh',
                    },
                  ],
                },
              ],
            })
          } catch (error) {
            logger.error(error)
          }
        })
        .catch((error) => console.log(error))
    } catch (error) {
      logger.error(error)
    }
  })
})()
