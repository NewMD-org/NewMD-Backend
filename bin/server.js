const app = require('../app');
const port = 3000;

app.set('port', port);

const server = app.listen(app.get('port'), () => {
    console.log('server is running on http://localhost:3000');
});