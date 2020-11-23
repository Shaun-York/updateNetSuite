const OAuth_1_0a = require('./tba');
const fetch = require('node-fetch');
const qs = require("querystring");
const {
    NETSUITE_CUSTOMER_ACCOUNT,
    NETSUITE_CONSUMER_TOKEN,
    NETSUITE_CONSUMER_TOKEN_SECRET,
    NETSUITE_ACCESS_TOKEN,
    NETSUITE_ACCESS_TOKEN_SECRET,
    NETSUITE_TIMEOUT_MS,
    NETSUITE_RETRYS,
    script,
    deploy,
    URI,
    cal_rt_ms
} = require('./config')

const retry = (func, attempt) => new Promise((resolve, reject) => {
    const ms = cal_rt_ms(attempt)
    console.info(`attempt ${attempt}, ms ${ms}.`)
    setTimeout(() => {
        resolve(func())
    }, ms)
})

const netsuite_mk_woc = async (record, current_retry) => {

    let payload = null

    if (record.new !== undefined) {
        payload = record.new
    } else if (record.data !== undefined) {
        payload = record.data
    } else {
        payload = record
    }

    const FLIGHT_QS = qs.stringify({
        script,
        deploy,
        ...payload
    })
    const completion_request = `${URI}${FLIGHT_QS}`;
    const nsheaders_completion = OAuth_1_0a(
        completion_request,
        NETSUITE_CUSTOMER_ACCOUNT,
        NETSUITE_CONSUMER_TOKEN,
        NETSUITE_CONSUMER_TOKEN_SECRET,
        NETSUITE_ACCESS_TOKEN,
        NETSUITE_ACCESS_TOKEN_SECRET
    )

    const request_options = {
        method: 'GET',
        timeout: NETSUITE_TIMEOUT_MS,
        headers: new fetch.Headers({
            ...nsheaders_completion,
            'Content-Type': 'application/json'
        })
    }

    try {
        const results = await fetch(completion_request, request_options)
        if (results.ok) {
            const data = await results.json()
            if (data.error) {
                if (data.error.code === 'SSS_REQUEST_LIMIT_EXCEEDED') {
                    console.info('NetSuite ', data.error.code, ' retry ', current_retry)
                    throw new Error(data.error.code)
                } else if (data.error.code === 'ETIMEDOUT') {
                    console.info('NetSuite ', data.error, ' retry ', current_retry)
                    throw new Error('ETIMEDOUT')
                } else {
                    console.info('NetSuite ', data.error, ' retry ', current_retry)
                    throw new Error('INTERNAL_NETSUITE_ERROR')
                }
            } else {
                return { netsuite_success: true,  ...payload, ...data }
            }
        }
    } catch (error) {
        const burn_a_try = current_retry + 1
        const retries_left = current_retry < NETSUITE_RETRYS

        if (error.message === 'SSS_REQUEST_LIMIT_EXCEEDED' && retries_left) {
            return await retry(() => netsuite_mk_woc(record, burn_a_try), burn_a_try)
        } else if (error.message === 'ETIMEDOUT' && retries_left) {
            return await retry(() => netsuite_mk_woc(record, burn_a_try), burn_a_try)
        } else if (error.type === 'request-timeout' && retries_left) {
            return await retry(() => netsuite_mk_woc(record, burn_a_try), burn_a_try)
        } else if (error.message === '504' && retries_left) {
            return await retry(() => netsuite_mk_woc(record, burn_a_try), burn_a_try)
        } else {
            return {
                failed: true,
                error: error.message,
                type: error.type
            }
        }
    }
}

module.exports = netsuite_mk_woc
