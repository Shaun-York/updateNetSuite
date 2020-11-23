const NETSUITE_CONSUMER_TOKEN_SECRET = process.env.NETSUITE_CONSUMER_TOKEN_SECRET
const NETSUITE_ACCESS_TOKEN_SECRET = process.env.NETSUITE_ACCESS_TOKEN_SECRET
const NETSUITE_CUSTOMER_ACCOUNT = process.env.NETSUITE_CUSTOMER_ACCOUNT
const NETSUITE_CONSUMER_TOKEN = process.env.NETSUITE_CONSUMER_TOKEN
const NETSUITE_ACCESS_TOKEN = process.env.NETSUITE_ACCESS_TOKEN
const URI = `https://${NETSUITE_CUSTOMER_ACCOUNT}.restlets.api.netsuite.com/app/site/hosting/restlet.nl?`
// Update with script id of restlet
const script = ''
// Update with deployment id 
const deploy = ''

const NETSUITE_TIMEOUT_MS = process.env.NETSUITE_REQUEST_MS
const NETSUITE_RETRYS = 5

const cal_rt_ms = (attempt) => Math.round(((2 ** (attempt - 1)) * 64) + (Math.random() * 100))

module.exports = {
    NETSUITE_CONSUMER_TOKEN_SECRET,
    NETSUITE_ACCESS_TOKEN_SECRET,
    NETSUITE_CUSTOMER_ACCOUNT,
    NETSUITE_CONSUMER_TOKEN,
    NETSUITE_ACCESS_TOKEN,
    NETSUITE_TIMEOUT_MS,
    NETSUITE_RETRYS,
    SCRIPT,
    DEPLOY,
    script,
    deploy,
    URI,
    cal_rt_ms
}