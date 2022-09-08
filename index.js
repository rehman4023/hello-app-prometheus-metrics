const express = require('express')
const promMid = require('express-prometheus-middleware');
const app = express()
const port = 9091

app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));


app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.get('/hello', (req, res) => {
    const { name = 'you' } = req.query;
    res.json({ message: `Hello, ${name}!` });
    console.log('GET /hello');
});


app.get('/hi', (req, res) => {
    const { name = 'you' } = req.query;
    res.json({ message: `Hi, ${name}!` });
    console.log('GET /hi');
});


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});