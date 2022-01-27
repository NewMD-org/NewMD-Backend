const axios = require('axios');

async function get(url) {
    try {
        const res = await axios.get(url);
        const data = res.data;
        console.log(data);
    }catch(err) {
        console.error(err);
    }
}

get('https://md-apps.herokuapp.com/API/Y313/1101/2');