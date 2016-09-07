var bunyan=require("bunyan");

console.log("Creating logger...");

global.log=bunyan.createLogger({
	name:"Twitter Bot 0.1v",
	level:10,
	serializers:{},
	src:false
});


//Serializers

