const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const update_netsuite = require('./update_netsuite')

function sendToNextSqs(message, receiptHandle) {
    return new Promise((resolve, reject) => {
        sqs.sendMessage(message, function (error, data) {
            if (error) {
                console.info(error, error.stack); // an error occurred
                reject(error.message)
            } else {
                console.log('SQS message send:', data)

                const delmessage = {
                    QueueUrl: process.env.OUTPUT_QUEUE,
                    ReceiptHandle: receiptHandle
                }

                sqs.deleteMessage(delmessage, function (error, data) {
                    if (error) {
                        console.log(error, error.stack)
                        reject('Failed to delete message')
                    } else {
                        console.log('SQS message deleted', data); // successful response
                    }
                })
                resolve(data)
            }
        })
    })
}

exports.handler = async (event) => {
    for (const { messageId, body, receiptHandle } of event.Records) {
        try {

            const payload = JSON.parse(body)
            
            const response = await update_netsuite(payload, 1)
            if (response.netsuite_success) {
                console.info('Sending ', messageId)
                const message = {
                    MessageBody: JSON.stringify(response),
                    QueueUrl: process.env.INPUT_QUEUE
                }
                await sendToNextSqs(message, receiptHandle)
            } else {
                throw new Error('Could not update netsuite...')
            }

        } catch (error) {
            console.info(error.message)
            throw new Error(error.message)
        }
    }
    return `Successfully processed ${event.Records.length} messages.`;
};
