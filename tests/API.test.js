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

get('http://localhost:3000');