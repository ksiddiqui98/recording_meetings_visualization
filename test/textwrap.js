function format(object,sentences,width,x,y){
    var words = sentences.split(" ");
    var containers=[];
    for(var i=0;i<words.length;i){
        var temp = "";
        while (temp.length<width && i<words.length){
            if(temp.length==0){
                temp+=words[i];
                i++;
            }else if(!(temp.length+1+words[i].length>width)){
                temp+=" ";
                temp+=words[i];
                i++;
            }
            if(i>=words.length ||temp.length+1+words[i].length>width){
                break;
            }
        }
        containers.push(temp);
    }
    for(var i=0; i<containers.length;i++){
        object.append("text").attr("x",x).attr("y",y+i*15).attr("text-anchor","beginning").text(containers[i]);
    }
}