const http = require('http');
const cron = require('node-cron');

const { collectTodayNews } = require('./news');
const { sendMessage } = require('./slack');
const { awakeHeroku } = require('./heroku');
const config = require('./config');

function main() {
  // Regular job for news feed.
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

  // Regular job to keep Heroku API alive.
  cron.schedule('* * * * *', async () => {
    try {
      await awakeHeroku(config.heroku.host);
      console.log('success')
    } catch (err) {
    }
    console.log('Keep alive')
  });

  // Setup a simple http server for Heorku API awaking.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('');
  }).listen(process.env.PORT || 5000);
}

main();
