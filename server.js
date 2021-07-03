const cron = require('node-cron');

const { collectTodayNews } = require('./news');
const { sendMessage } = require('./slack');
const config = require('./config');

function main() {
  cron.schedule('0 13 * * *', async () => {
    try {
      const newsInfos = await collectTodayNews(
        config.news.keywords,
        process.env.NEWS_API_KEY,
      );
      for (newsInfo of newsInfos) {
        const message = `${newsInfo.title}\n${newsInfo.url}`;

        await sendMessage(
          message,
          config.slack.channel,
          process.env.SLACK_TOKEN,
        );
      }
      console.log('Success for news feed')
    } catch (err) {
      console.error(err);
    }
  });
}

main();
