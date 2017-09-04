const amqp = require('amqplib')
const async = require('async')

let _channel = null

if (process.argv.length < 3) {
  console.log('Specify node path')
} else {

	let exchange = [
		// edd test queue names
		'demo.channel', 'demo.plugin.gateway', 'demo.plugin.channel',
		'demo.gateway', 'demo.pipeline'
	]

	let qn = [
		// reekoh specific
		'data','deviceinfo','deviceonline','pendingcommand','devices','exceptions','logs','messages',

		// reekoh specific
		'agent.exceptions','agent.logs','agent.messages','agent.devices','agent.data',

		// edd test queue names
		'demo.channel','demo.channel.pipe','demo.dev-sync',
		'demo.gateway','demo.outpipe.1','demo.outpipe.2','demo.pipe.channel', 'demo.plugin.channel',
		'demo.pipeline','demo.storage',

		'cmd.process',
		'demo.ExceptionLogger',
		'pa.inventory.sync',
		'pa.inv.sync',
		'pa.job.sync',
		'demo.pipe.logger', 'demo.pipe.storage',
		'demo.cmd.relays', 'cmd.responses', 'demo.channel.cmd.relay',
		'demo.relay1.topic', 'demo.relay2.topic',
		'demo.relay1', 'demo.relay2',
		'demo.outpipe1', 'demo.outpipe2',
		'outpipe.1', 'outpipe.2',
		'demo.relay1','demo.relay2',
		'demo.relay1,demo.relay2',
		'demo.cmd.relay',
		'plugin.state.rpc',
		'plugin.state',
		'demo.stream',
		'demo.exception-logger',
		'demo.pipe.exception-logger',
		'demo.pipe.service',
		'device.info.rpc',
		'device.online.rpc',
		'cmd.pending.rpc',
		'node.relay1',
		'demo.service',
		'demo.logger',
		'demo.inv-sync',
		'demo.channel.topic',
		'demo.channel.pipe.topic',
		'd','e','m','o','o','u','t','p','i','p','e','1','2',',','.',
		

		'logs1', 'logs2',
		'exlog1', 'exlog2',
		'ex.logger2', 'logger2',
		'rpc_queue', 'app.js',

		// ji/aks q
		'Op1','Op2','Pl1','cip1', 'Ip1', 'Ip2', 'logger2', 'ip.onedrive',
		'exlogger1','exlogger2','lip.1','lipexcp.1','logger1','logger2',
		'ex.logger1','ex.logger2', 'demo.cmd.relays.topic',
		'cr1.topic', 'cr2.topic',
		'plugin1','sip1','undefined'
	]

	async.waterfall([

		(done) => {
	    amqp.connect(`amqp://guest:guest@127.0.0.1${process.argv[2]}`).then((conn) => {
	      return conn.createChannel()
	    }).then((channel) => {
	      _channel = channel
	      return done() || null
	    }).catch(done)
		},

		(done) => {
			console.log('Removing basic queues..')
			async.each(qn, (q, cb) => {
				if (!q) return cb() || null
				
				// console.log(' >', q)
				_channel.deleteQueue(q).then((ret) => {
					cb()
				})

			}, done)
		},

		(done) => {
			console.log('Removing exchange queues..')
			async.each(exchange, (ex, cb) => {
				if (!ex) return cb() || null
				
				// console.log(' >', ex)
				_channel.deleteExchange(ex).then((ret) => {
					cb()
				})

			}, done)
		}

	], (err) => {
		if (err) return console.log(err)


		console.log('Queues cleared..')
		process.exit()
		
	})
}