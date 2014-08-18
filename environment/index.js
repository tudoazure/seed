module.exports = {
   host : 'http://bargain-dev.paytm.com',
   catalog : 'https://catalogapidev.paytm.com',
   domain: 'bargain',
   oauth : require('./oauth'),
   fulfillment: {
   		host: 'http://fulfillment-dev.paytm.com'
    },
	chatServer: {
		host: 'chat-staging.paytm.com'
	}
};