import app from "../app.js";
const port = process.env.PORT || 3000;

app.set('port', port);

const server = app.listen(app.get('port'), () => {
    console.log('server is running on http://localhost:3000');
});