var authModule=require("./config/auth");
var GenericClient=require("./clients/genericClient");
var SearchTweetsCtrl=require("./controllers/searchTweets");
var authenticator=authModule.authenticator;

var searchTweetsLiveProcess;

var processList=configProcessList();
var liveProcess=[];

var firstTime=true;

authenticator.on("success",function(loadDataF){

	loadDataF();
	if(firstTime){
		scheduleProcesses();
		firstTime=false;
	}

});

authenticator.on("error",function(err,path){
	global.log.tracec({error:err},"Error during request to "+ path);
})

authenticator.doAuth();


function scheduleProcesses(){

	for (var proc of processList){
		if(proc.runnable && !proc.intervalObj){
			proc.intervalObj=setInterval(proc.ctrlr.doProcess,proc.delay);
			liveProcess.push(proc);
		}
	}
};

function configProcessList(){
	var ret=[];
	var searchTweets={
		runnable:true,
		delay:20000,
		ctrlr:new SearchTweetsCtrl(new GenericClient()),
		intervalObj:null
	}
	ret.push(searchTweets);

	global.log.trace({processList:ret},"Actual list of process to schedule");

	return ret;
}

// ./config/auth.js