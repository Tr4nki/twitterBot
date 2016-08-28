var bunyan=require("bunyan");

console.log("Creating logger...");

global.log=bunyan.createLogger({
	name:"Twitter bot logger",
	level:10,
	serializers:{},
	src:false
});


//Serializers

