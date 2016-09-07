var querystring=require("querystring");
var statics=require("../resources/statics");
//__DOCU__
//https://dev.twitter.com/rest/reference/get/search/tweets
//https://dev.twitter.com/rest/public/search
var Controller=function(client){


	this.init=function(){
		global.log.trace("Initializating controller... [searchTweets]")
		this.setOpts();
	};

	this.composeQuery=function(query){
		if(!query){
			query={
				q:"Morning Giorno Días OR Dias from:newenergyaborda since:"+formatDate(),
				result_type:"recent"
			};
		}
		global.log.trace({query:query},"Query to parse");
		this.queryString=querystring.stringify(query);

		global.log.trace({query:this.queryString},"Así queda de momento la query");

	};
	this.setOpts=function(bearer,query){
		this.composeQuery();
		this.opts={
			method:"GET",
			path:statics.endPoints.searchTweets+"?"+this.queryString,
			headers:{
				Authorization:"Bearer " + bearer,
			}
		}
	};

	this._doProcess=function(){
		this.setOpts(global.bearer);
		client.request(this.opts,this.customCallback);
	};

	this.customCallback=function(httpCode,resBody){

		try{
			resBody=JSON.parse(resBody);
		}catch(e){
			global.log.trace({err:e},"Error parsing responseBody")

		}

		switch(httpCode){
			case 200:{
				global.log.trace({body:resBody},"End process with this result");
				break;
			}
			case 401:{
				global.log.trace({body:resBody},"Ccompadre que no te conocen");
				break;
			}
			
			default:{
				global.log.error({responseBody:resBody},"Unspected HTTP status ("+httpCode+")");
				break;
			}
		}

	}
	this.init();

	return{
		doProcess:this._doProcess.bind(this)
	};


}

function formatDate(){
	var d=new Date();
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate()-2);
}

module.exports=Controller;