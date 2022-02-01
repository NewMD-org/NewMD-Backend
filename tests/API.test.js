const axios = require('axios');

async function get(url) {
    try {
        let res = await axios.get(url);
        data = await res.data;
        console.log(data);
    }catch(err) {
        console.error(err);
    }
}

get('http://localhost:3000/mdcloud/login/B123793073/8888888888');