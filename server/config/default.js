module.exports = {
    port: 8003,
    url: 'mongodb://111.229.251.78:27018/webchat',
    session: {
        name: 'UID',
        secret: 'UID',
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 365 * 24 * 60 * 60 * 1000,
        }
    }
}