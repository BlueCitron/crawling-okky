const axios = require('axios');
const cheerio = require('cheerio');
const sanitize = require('sanitize-html');
const { sequelize, Post, Comment } = require('./models');

const BASE_URL = 'https://okky.kr';
const START_PAGE = `${BASE_URL}/articles/community`;
const environment = process.env.NODE_ENV;
const TIMER_PERIOD = environment === 'production' ? 1000 * 60 * 15 : 2000;

/**
 * Main Context
 */
(async () => {
    // init sequelize
    startLogging();
    await sequelize.sync({ force: false });

    setTimeout(async () => {
        const data = await fetchPostList(START_PAGE);
        const postURL = makeTargetPostURL(data);
       const jobPromises = postURL.map(url => postJob(url));
        Promise.all(jobPromises)
            .then(result => {

            });

    }, TIMER_PERIOD);


})();

function startLogging() {
    console.log(`Environment: ${environment}`);
    console.log(`TIME_PERIOD: ${TIMER_PERIOD}`);
}

async function fetchPostList(url) {
    const { data }  = await axios.get(url);
    return data;
}

function makeTargetPostURL(data) {
    return data.map(el => `/article/${el.id}`);
}

async function postJob(url) {
    const postHTML = await fetchPost(url);
    const postInfo = getPostInfo(postHTML);
    await saveToDB(postInfo);
}

async function fetchPost(url) {
    const { data } = await axios.get(BASE_URL + url, {
        headers: { Accept: 'text/html, */*' }
    });
    return data;
}

function getPostInfo(html) {
    const $ = cheerio.load(html, { xml: { normalizeWhitespace: true } });
    const id = $('.article-id').text().replace('#', '');
    const title = $('h2.panel-title').text();
    const writer = $('.nickname').first().text();
    const content = sanitize($('.content-text').html(), {
        parser: { decodeEntities: true }
    });
    const createdAt = $('.timeago').first().text();
    const comments = [];

    $('.note-item').each((index, el) => {
        const id = $(el).find('.note-text').attr('id').replace('note-text-', '');
        const writer = $(el).find('.nickname').text();
        const content = sanitize($(el).find('.note-text').html(), {
            parser: { decodeEntities: true }
        });
        const createdAt = $(el).find('.timeago').first().text();
        comments.push({ id, writer, content, created_at: createdAt });
    });
    return { id, title, writer, content, created_at: createdAt, comments };
}

async function saveToDB(postInfo) {
    const { id, title, writer, content, created_at, comments } = postInfo;

    try {
        await Post.create({ id, title, writer, content, created_at });
        for (const comment of comments) {
            await Comment.create({ ...comment, post_id: id });
        }
        console.log(`CREATE POST: ${title}`);
    } catch (e) {
        // console.log(e);
    }
}