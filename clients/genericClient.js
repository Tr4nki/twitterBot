var https=require("https");
var statics=require("../resources/statics.js");


var _GenericClient=function(){

	this.request=function(_opts,returnCB){


		var httpsOpts={
			hostname:statics.hostname,
			method:_opts.method,
			path:_opts.path,
			headers:_opts.headers
		};

		global.log.trace({opts:httpsOpts},"Options to use in the request");

		var req=https.request(httpsOpts,function(res){
			var responseBody="";

			//global.log.trace({res:res},"done with request")

			res.setEncoding("utf8");

			res.on("data",function(data){
				responseBody+=data;
			});

			res.on("end",function(){
				returnCB(res.statusCode,responseBody);
			});

			res.on("error",function(err){
				returnCB(res.statusCode,responseBody,err);
			});

		});

		if(_opts.body && (_opts.method=="POST" || _opts.method=="PUT"))
			req.end(_opts.body,"utf8");
		else
			req.end();

	}
}

module.exports=_GenericClient;