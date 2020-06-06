function classifiedAccordingToKey(objectArray,key)	
	{ 
var newObj = {}; 
objectArray.forEach(function (obj) { var array = newObj[obj[key]] || []; array.push(obj); newObj[obj[key]] = array; }); return newObj; }


module.exports = {
    classifiedAccordingToKey
}

