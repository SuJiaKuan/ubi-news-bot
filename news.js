const axios = require('axios');
const moment = require('moment');
const qs = require('qs');
const uuid = require('uuid');

const { NEWS_API_EDNPOINT } = require('./const');

async function getNews(keywords, apiKey, from, to, lang) {
  const queries = qs.stringify({
    q: keywords,
    apiKey,
    from,
    to,
    language: lang,
  });

  const url = `${NEWS_API_EDNPOINT}?${queries}`;
  const res = await axios.get(url);

  return res.data.articles;
}

async function collectTodayNews(keywords, apiKey, lang) {
  // const today = moment().format('YYYY-MM-DD').toString();
  const today = '2020-05-01';
  const transformedKeywords = keywords.map(k => `\"${k}\"`).join(' OR ');
  const trueKeywords = '\"無條件基本收入\" OR \"全民基本收入\"'

  const articles = await getNews(
    transformedKeywords,
    apiKey,
    today,
    today,
    lang,
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
