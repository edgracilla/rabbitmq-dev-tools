const amqp = require('amqplib')
const async = require('async')

let _channel = null

let exchange = [
	// edd test queue names
	'demo.channel'
]

let qn = [
	// reekoh specific
	'data', 'deviceinfo','devices','exceptions','logs','messages',

	// reekoh specific
	'agent.exceptions','agent.logs',

	// edd test queue names
	'demo.channel','demo.channel.pipe','demo.dev-sync',
	'demo.gateway','demo.outpipe.1','demo.outpipe.2','demo.pipe.channel',
	'demo.pipeline','demo.storage',

	// ji/aks q
	'Op1','Op2','P|1','cip1',
	'exlogger1','exlogger2','lip.1','lipexcp.1','logger1','logger2',
	'plugin1','sip1','undefined'
]


async.waterfall([

	(done) => {
    amqp.connect('amqp://guest:guest@127.0.0.1/').then((conn) => {
      return conn.createChannel()
    }).then((channel) => {
      _channel = channel
      return done() || null
    }).catch(done)
	},

	(done) => {
		console.log('Removing queues..')
		async.each(qn, (q, cb) => {
			if (!q) return cb() || null
			
			console.log(' >', q)
			_channel.deleteQueue(q).then((ret) => {
				cb()
			})

		}, done)
	},

	(done) => {
		console.log('Removing exchange queues..')
		async.each(exchange, (ex, cb) => {
			if (!ex) return cb() || null
			
			console.log(' >', ex)
			_channel.deleteExchange(ex).then((ret) => {
				cb()
			})

		}, done)
	}

], (err) => {
	if (err) return console.log(err)


	console.log('\n~ done!')
	process.exit()
	
})