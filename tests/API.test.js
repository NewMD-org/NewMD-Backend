const fetch = require('node-fetch');

async function get(url) {
    try {
        let data = await fetch(url);
        data = await data.json();
        console.log(data);
    }catch(err) {
        console.error(err);
    }
}

get('https://md-apps.herokuapp.com/API/Y313/1101/2');