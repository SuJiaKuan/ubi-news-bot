const axios = require('axios');
const moment = require('moment');
const qs = require('qs');
const uuid = require('uuid');

const { NEWS_API_EDNPOINT } = require('./const');

async function getNews(keywords, apiKey, from, to) {
  const queries = qs.stringify({
    q: keywords,
    apiKey,
    from,
    to,
  });

  const url = `${NEWS_API_EDNPOINT}?${queries}`;
  const res = await axios.get(url);

  return res.data.articles;
}

async function collectTodayNews(keywords, apiKey) {
  // const today = moment().format('YYYY-MM-DD').toString();
  const today = '2021-06-14';
  const transformedKeywords = keywords.map(k => `\"${k}\"`).join(' OR ');

  const articles = await getNews(
    transformedKeywords,
    apiKey,
    today,
    today,
  );
  const newsInfos = articles.map(n => ({
    uuid: uuid.v4(),
    source: n.source,
    author: n.author,
    title: n.title,
    url: n.url,
    publishedAt: n.publishedAt,
  }))

  return newsInfos;
}

module.exports = {
  collectTodayNews,
}
