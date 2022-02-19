const axios = require('axios');
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

function makeDriver(headers = {}) {
  let cookies = '';

  return async function driver(context, callback) {
    const url = context.url;
    let result;
    try {
      result = await axios({
        url,
        headers: {
          ...headers,
          Cookie: cookies,
        },
      });
    } catch (exception) {
      console.error(`Error while trying to scrape data from ${url}. Received error: ${exception.message}`);
      callback(null, []);
    }

    if (result !== undefined && typeof result.data === 'object' && url.toLowerCase().indexOf('scrapingant') !== -1) {
      //assume we have gotten a response from scrapingAnt
      if (cookies.length === 0) {
        cookies = result.data.cookies;
      }
      callback(null, result.data.content);
    } else {
      callback(null, result !== undefined ? result.data : []);
    }
  };
}

module.exports = makeDriver;
