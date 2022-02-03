const axios = require('axios');
const { data } = require('cheerio/lib/api/attributes');

async function get(url) {
    try {
        let res = await axios.get(url);
        let data = await res.data;
        return data;
    } catch (err) {
        console.error(err);
    }
}

get('http://localhost:3000/mdcloud/fastTable/b123793073/8888888888')
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log('error:::', err);
    })