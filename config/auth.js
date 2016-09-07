var https=require("https");
var EventEmitter = require('events');

function step1(){

	var consumer_key=encodeURIComponent("oYXx05f7ZL10xS6dRK1W53hgz");
	var consumer_secret=encodeURIComponent("W1K2gBfxai7n9fcqSL6LijfXxgnvYrBg0z1SX3gYkRmyNwgvVV");

	return new Buffer(consumer_key+":"+consumer_secret).toString("base64");
}

function step2(creds,finalStepCB){

	var body="grant_type=client_credentials";

	var httpsOpts={
		hostname:"api.twitter.com",
		method:"POST",
		path:"/oauth2/token",
		headers:{
			Authorization:"Basic "+creds,
			"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8",
			//"Accept-Encoding": "gzip"
		}
	}
	var responseBody="";

	var req=https.request(httpsOpts,function(res){

		res.setEncoding("utf8");
		res.on("data",function(data){
			responseBody+=data;
		});
		res.on("end",function(){
			global.log.trace("Succesful end of data " +httpsOpts.path);
			if(finalStepCB && (finalStepCB instanceof Function))
				finalStepCB(responseBody);
			else{
				global.log.trace("endProcess seems like is not a funcction LOL");
				_authenticator.emit("error",new Error("Final step could not be reached"),httpsOpts.path);
			}
		});
		res.on("error",function(err){
			_authenticator.emit("error",err,httpsOpts.path);
		});

	});
	//req.on("")
	req.end(body,"utf8");
}

function step3(auth){

	var bearer=JSON.parse(auth);

	global.log.trace({token:bearer},"Result step 2. Issued request, getting Bearer Token...");
	
	var loadCredentialsFunction=function(){

		return function(){
			global.bearer=bearer.access_token;
		}
	}();
	_authenticator.emit("success",loadCredentialsFunction);
}


var _authenticator=new EventEmitter();

_authenticator.doAuth=function(){

	var credentials=step1();
	global.log.trace({creds:credentials},"Result step1 ");

	step2(credentials,step3);
};

exports.authenticator=_authenticator;
