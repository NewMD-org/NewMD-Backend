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

get('http://localhost:3000/mdcloud/login/B123793073/8888888888')
    .then(data1 => {
        get(`http://localhost:3000/mdcloud/stdData/${data1.cookie}`)
            .then(data => {
                console.log(data);
            }).catch(err => {
                console.log('wrong in second place');
            });
    }).catch(err => {
        console.log('wrong in first function');
    })