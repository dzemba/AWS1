var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var INDEX_TEMPLATE = "sentPhoto.ejs";

var sqs = new AWS.SQS();

var task = function (request, callback) {
	var resizeValueX = parseInt(request.body.resizeValueX);
	var resizeValueY = parseInt(request.body.resizeValueY);
	var fileList = JSON.parse(request.body.files);
	console.log("resizeX: " + resizeValueX + " resizeY: " + resizeValueY);

	for (var i = 0; i < fileList.length; i++) {
		var params = {
			MessageBody : JSON.stringify({
				file : fileList[i],
				resizeValueX : resizeValueX,
				resizeValueY : resizeValueY
			}),
			QueueUrl : 'https://sqs.us-west-2.amazonaws.com/482896963836/dzemba-queue'
		};
		sqs.sendMessage(params, function (err, data) {
			if (err) {
				console.log(err, err.stact);
			} else {
				callback(null, {
					template : INDEX_TEMPLATE,
					params : {
						fields : null,
						bucket : null
					}
				});
			}
		});
	}
}

exports.action = task;
