require('dotenv').config()
const http = require('http')
const fs = require('fs')
const Cookies = require('cookies')
const uuid = require('uuid/v1')
const axios = require("axios")
const Url = require('url')

if (!process.env.GA) {
    console.error("GA required");
    process.exit(1);
}

const filename = process.env.FILENAME || "1px-transparent.png"
const port = process.env.PORT || 4011
const host = process.env.HOST || "127.0.0.1"
const secret = process.env.SECRET || "verysecret"
const gaurl = process.env.GAURL || "https://www.google-analytics.com/collect"

var hits = 0

class AnalyticsCollect {
    constructor(ga) {
        if (!ga) throw("ga required");
        this.ga = ga;
    }

    async hit(req, res) {
        const cookies = new Cookies(req, res, { keys: [ secret ] })
        var uid = cookies.get('uid', { signed: true })
        if (!uid) {
            uid = uuid();
            cookies.set('uid', uid, { signed: true })
        }
        const url = Url.parse(req.url);
        var hostname = Url.parse(process.env.URL);
        const data = {
            v: 1,
            tid: this.ga,
            uid,
            t: "pageview",            
            ua: req.headers["user-agent"],
            uip: req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']  || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null),
            dr: req.headers.referer,
            dp: url.pathname,
            dh: hostname.host,
        }
        console.log(data);
        try {
            const result = await axios.get(gaurl, { params: data })
            console.log(result.status, result.statusText);
        } catch(err) {
            console.error(err);
        }
    }
}

const analytics = new AnalyticsCollect(process.env.GA);

http.createServer((req, res) => {
    if (req.url == '/favicon.ico') return;
    analytics.hit(req, res)
    res.writeHead(200, { "Content-Type" : "image/png" })
    const fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
    hits++;
}).listen(port, host, () => {
    console.log(`Server listening ${ host }:${ port }`);
});

if (process.env.REPORTINTERVAL) setInterval(() => { console.log(`Hits: ${ hits }`)}, process.env.REPORTINTERVAL)