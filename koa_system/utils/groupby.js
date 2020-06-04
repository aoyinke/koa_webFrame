function groupBy(arr,key){
    var map = {},
        dest = [];
    for(var i = 0; i < arr.length; i++){
        var ai = arr[i];
        if(!map[ai[key]]){
            dest.push({
            uid:ai.uid,
            groupId:ai.groupId,
            poisition:ai.poisition,
            auth:ai.auth,
            avatar:ai.avatar,
            nickName:ai.nickName

        });
            map[ai[key]] = ai;
        }else{
            for(var j = 0; j < dest.length; j++){
                var dj = dest[j];
                if(dj[key]== ai[key]){
                    dj.data.push(ai);
                    break;
                }
            }
        }
    }
    return dest
}


export {
    groupBy
}

