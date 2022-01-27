const app = require('../app');
const cors = require('cors');
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(cors());

const server = app.listen(app.get('port'), () => {
    console.log('server is running on http://localhost:3000');
});