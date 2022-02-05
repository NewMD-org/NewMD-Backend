import axios from 'axios';

async function get(url) {
    try {
        let res = await axios.get(url);
        let data = await res.data;
        return data;
    } catch (err) {
        console.error(err);
    }
}

get('http://localhost:3000/API/Y313/1104')
    .then(data => {
        console.log(data);
    }).catch(err => {
        console.log('error:::', err);
    })