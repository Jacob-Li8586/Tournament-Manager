function Page(html){
    window.location.href=html+'.html';
}
function checkChanges(){ //onchange for player list input
    const SP_amount=parseInt(document.getElementById("SP_amount").value);
    //trim to avoid empty line
    const SP_list=document.getElementById("SP_text").value.split("\n").filter(item=>item.trim()!="");
    const OP_list=document.getElementById("OP_text").value.split("\n").filter(item=>item.trim()!="");
    var requireDrawSize=SP_amount+OP_list.length;
    //change the colour of the button to show the input is valid/ invalid
    if(SP_amount==SP_list.length&&requireDrawSize>=2){
        const Cbutton=document.getElementById("Cbutton");
        Cbutton.classList.replace("is-danger","is-success");
    }
    else{
        const Cbutton=document.getElementById("Cbutton");
        Cbutton.classList.replace("is-success","is-danger");
    }
    document.getElementById("PlayerAmount").innerText="Amount of players: "+(SP_list.length+OP_list.length);
}
function CreateDraw(){
    const SP_amount=parseInt(document.getElementById("SP_amount").value);
    var SP_list=document.getElementById("SP_text").value.split("\n").filter(item=>item.trim()!="");
    const OP_list=document.getElementById("OP_text").value.split("\n").filter(item=>item.trim()!="");
    var requireDrawSize=SP_amount+OP_list.length;
    //give seeded sign to seeded players
    for(var i=0;i<SP_list.length;i++){
        SP_list[i]= SP_list[i]+" ["+(i+1)+"]";
    }
    if(SP_amount==SP_list.length&&requireDrawSize>=2){
        //draw creating
        //puting all the seeded players in order
        var seededList=SP_list,otherList=OP_list,seededOrderList=[];
        while(seededList.length>2){
            var tempList=seededList.slice(seededList.length/2);
            seededList.splice(seededList.length/2);
            shufflearray(tempList);
            var area=SP_amount/tempList.length;
            var index=-1;
            for(var i=0;i<tempList.length;i++){
                index+=area;
                var tempindex=index;
                while(seededOrderList[tempindex]!=undefined){
                    tempindex--;
                }
                seededOrderList[tempindex]=tempList[i];
            }
        }
        if(seededList.length==2){
            seededOrderList[0]=seededList[0];
            if(seededOrderList.length==1){
                seededOrderList[1]=seededList[1];
            }
            else{
                seededOrderList[seededOrderList.length/2]=seededList[1];
            }    
        }
        var drawSize=2;
        //puting all the other players into the draw
        while(drawSize<requireDrawSize){
            drawSize*=2;
        }
        var emptyAmount=drawSize-OP_list.length-SP_amount,otherList=OP_list;
        for(var i=0;i<emptyAmount;i++){
            otherList.push("Bye");
        }
        shufflearray(otherList);
        var drawList=[],area=drawSize/seededOrderList.length;
        for(var i=0;i<seededOrderList.length;i++){
            drawList[i*area]=seededOrderList[i];
        }
        var index=0;
        for(var i=0;i<otherList.length;i++){
            while(drawList[index]!=undefined){
                index++;
            }
            drawList[index]=otherList[i];
        }
        sessionStorage.setItem("drawList",drawList);
        sessionStorage.setItem("udrawList",u(drawList,"to be confirm"));
        sessionStorage.setItem("ScoreList",u(new Array(drawList.length).fill(" ")," "));
        window.location.href="draw.html";
    }
    else{
        if(isNaN(SP_amount)){
            unselectN_hide(false);
        }
        else if(requireDrawSize<=1){
            emptyN_hide(false);
        }
        else{
            sameN_hide(false);
        }
    }
}
function unselectN_hide(b){
    document.getElementById("unselectN").hidden=b;
}
function sameN_hide(b){
    document.getElementById("sameN").hidden=b;
}
function emptyN_hide(b){
    document.getElementById("emptyN").hidden=b;
}
function u(drawList,filler){
    var udrawList=[];
    udrawList[0]=drawList;
    var l=drawList.length/2,index=0;
    for(var i=l;i>=1;i/=2){
        index++;
        udrawList[index]=new Array(i).fill(filler);
    }
    return udrawList;
}
function A2A_2d(A){
    var A_2d=[],i=1,b=0;
    while(A.length!=0){
        A_2d[b]=A.slice(-i);
        A.splice(-i,i);
        b++;
        i*=2;
    }
    A_2d.reverse();
    return A_2d;
}
function shufflearray(array){ //The Fisher-Yates algorithm
    for (let i = array.length-1;i>0;i--) {
        let j=Math.floor(Math.random()*(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function loadDraw(column_index){
    document.getElementById("draw").innerHTML="";
    document.getElementById("matches").innerHTML="";
    const marginlist_top=[0,102,270,600,1250];
    const marginlist=[0,188,515,1170,2600];
    var udrawList=sessionStorage.getItem("udrawList").split(',');
    udrawList=A2A_2d(udrawList);
    var ScoreList=sessionStorage.getItem("ScoreList").split(',');
    ScoreList=A2A_2d(ScoreList);
    var rounds=Math.log2(udrawList[0].length);
    var roundlist=[];
    for(var i=0;i<rounds;i++){
        var roundType;
        if(i==0){
            roundType="Final";
        }
        else if(i==1){
            roundType="SF";
        }
        else if(i==2){
            roundType="QF";
        }
        else{
            roundType="R"+Math.pow(2,i+1);
        }
        roundlist.push(roundType);
    }
    roundlist.reverse();
    if(column_index>=1){
        document.getElementById("la").disabled=false;
    }
    else{
        document.getElementById("la").disabled=true;
    }
    if(rounds-column_index<=4){
        document.getElementById("ra").disabled=true;
    }
    else{
        document.getElementById("ra").disabled=false;
    }
    for(var i=column_index;i<rounds&&i<column_index+4;i++){
        document.getElementById("draw").innerHTML+='<div id="'+roundlist[i]+'" class="column"><div class="box has-background-grey-lighter subtitle">'+roundlist[i]+'</div></div>';
        for(var x=0;x<udrawList[i].length;x+=2){
            var P1name=udrawList[i][x],P2name=udrawList[i][x+1];
            if(P1name=="Bye"){
                udrawList[i+1][x/2]=P2name;
            }
            if(P2name=="Bye"){
                udrawList[i+1][x/2]=P1name;
            }
            if(i==0){
                document.getElementById(roundlist[i]).innerHTML+='<div class="box"><div class="level"><div class="level-left"><div class="subtitle" id="P1N'+i+','+x+'">'+P1name+'</div></div><div class="level-right"><div class="subtitle" id="P1S'+i+','+x+'">'+ScoreList[i][x]+'</div></div></div><hr class="divider"><div class="level"><div class="level-left"><div class="subtitle" id="P2N'+i+','+(x+1)+'">'+P2name+'</div></div><div class="level-right"><div class="subtitle" id="P2S'+i+','+(x+1)+'">'+ScoreList[i][x+1]+'</div></div></div>';
            }
            else if(x==0){
                document.getElementById(roundlist[i]).innerHTML+='<div class="box" style="margin-top:'+marginlist_top[i-column_index]+'px"><div class="level"><div class="level-left"><div class="subtitle" id="P1N'+i+','+x+'">'+P1name+'</div></div><div class="level-right"><div class="subtitle" id="P1S'+i+','+x+'">'+ScoreList[i][x]+'</div></div></div><hr class="divider"><div class="level"><div class="level-left"><div class="subtitle" id="P2N'+i+','+(x+1)+'">'+P2name+'</div></div><div class="level-right"><div class="subtitle" id="P2S'+i+','+(x+1)+'">'+ScoreList[i][x+1]+'</div></div></div>';
            }
            else{
                document.getElementById(roundlist[i]).innerHTML+='<div class="box" style="margin-top:'+marginlist[i-column_index]+'px"><div class="level"><div class="level-left"><div class="subtitle" id="P1N'+i+','+x+'">'+P1name+'</div></div><div class="level-right"><div class="subtitle" id="P1S'+i+','+x+'">'+ScoreList[i][x]+'</div></div></div><hr class="divider"><div class="level"><div class="level-left"><div class="subtitle" id="P2N'+i+','+(x+1)+'">'+P2name+'</div></div><div class="level-right"><div class="subtitle" id="P2S'+i+','+(x+1)+'">'+ScoreList[i][x+1]+'</div></div></div>';
            }
            if(udrawList[i+1][x/2]==P1name&&P1name!="to be confirm"&&P1name!="Bye"){
                document.getElementById("P1N"+i+','+x).classList.add("has-text-weight-bold");
                document.getElementById("P1S"+i+','+x).classList.add("has-text-weight-bold");
                document.getElementById("P1S"+i+','+x).innerHTML='<i class="fas fa-circle" style="color:limegreen;"></i>'+document.getElementById("P1S"+i+','+x).innerHTML;
            }
            if(udrawList[i+1][x/2]==P2name&&P2name!="to be confirm"&&P2name!="Bye"){
                document.getElementById("P2N"+i+','+(x+1)).classList.add("has-text-weight-bold");
                document.getElementById("P2S"+i+','+(x+1)).classList.add("has-text-weight-bold");
                document.getElementById("P2S"+i+','+(x+1)).innerHTML='<i class="fas fa-circle" style="color:limegreen;"></i>'+ document.getElementById("P2S"+i+','+(x+1)).innerHTML;
            }
        }
    }
    for(var i=0;i<udrawList.length-1;i++){
        for(var l=0;l<udrawList[i].length;l+=2){
            roundType='R'+udrawList[i].length;
            if(udrawList[i].length==8)roundType="QF";
            if(udrawList[i].length==4)roundType="SF";
            if(udrawList[i].length==2)roundType="Final";
            document.getElementById("matches").innerHTML+=`<div class="box has-background-grey-lighter pt-3 px-3 pb-1">
            <div class="box mb-1">
            <div class="level">
              <div class="level-left">
                <p class="subtitle" id="P1Name`+i+","+l+`">`+udrawList[i][l]+`</p>
              </div>
              <div class="level-right">
              <div id="P1Dot`+i+","+l+`"></div>
              <p class="subtitle" id="P1Score`+i+","+l+`">`+ScoreList[i][l]+`</p>
            </div>
              
            </div>
            <hr class="divider">
            <div class="level">
              <div class="level-left">
                <p class="subtitle" id="P2Name`+i+","+l+1+`">`+udrawList[i][l+1]+`</p>
              </div>
              <div class="level-right">
                <div id="P2Dot`+i+","+l+1+`"></div>
                <p class="subtitle" id="P2Score`+i+","+l+1+`">`+ScoreList[i][l+1]+`</p>
               </div>
            </div>
            </div>
            <div class="level">
            <button class="button is-ghost has-text-black">`+roundType+`</p>
            <button class="button is-small" onclick='modaldisplay(true,"`+udrawList[i][l]+'","'+udrawList[i][l+1]+'",'+i+','+l+`)'>Set results</button>
            <button class="button is-small" onclick="Page('umpire');resetUmpire();sessionStorage.setItem('PA1','`+udrawList[i][l]+`');sessionStorage.setItem('NeedToEditDraw','true');sessionStorage.setItem('PB1','`+udrawList[i][l+1]+`');sessionStorage.setItem('i',`+i+`);sessionStorage.setItem('l',`+l+`);">Umpire this Game</button>
            </div>
            </div>
            </div>`;
            if(udrawList[i][l]==udrawList[i+1][l/2]&&udrawList[i][l]!="to be confirm"&&udrawList[i][l]!="Bye"){
                document.getElementById("P1Name"+i+","+l).classList.add("has-text-weight-bold");
                document.getElementById("P1Score"+i+","+l).classList.add("has-text-weight-bold");
                document.getElementById("P1Dot"+i+","+l).innerHTML='<i class="fas fa-circle" style="color:limegreen;"></i>';
            }
            if(udrawList[i][l+1]==udrawList[i+1][l/2]&&udrawList[i][l+1]!="to be confirm"&&udrawList[i][l+1]!="Bye"){
                document.getElementById("P2Name"+i+","+l+1).classList.add("has-text-weight-bold");
                document.getElementById("P2Score"+i+","+l+1).classList.add("has-text-weight-bold");
                document.getElementById("P2Dot"+i+","+l+1).innerHTML='<i class="fas fa-circle" style="color:limegreen;"></i>';
            }
        }
        
    }     
}

function dP(x){
    ci=parseInt(sessionStorage.getItem("drawPage"));
    sessionStorage.setItem("drawPage",ci+x);
    loadDraw(ci+x)
}
function resetUmpire(){
    sessionStorage.setItem("Team1Error",0);
    sessionStorage.setItem("Team2Error",0);
    sessionStorage.setItem("SetScore",21);
    sessionStorage.setItem("SetAmount",3);
    sessionStorage.setItem("MaxDeuce",30);
    sessionStorage.setItem("Deuce","true");
    sessionStorage.setItem("MatchDuration",0);
    sessionStorage.setItem("ScoreSequence","");
    sessionStorage.setItem("gamewon","false");
    sessionStorage.setItem("GameType","singles");
    sessionStorage.setItem("winner","0");
}
function UpdateSetLimit(){
    sessionStorage.setItem("SetScore",document.getElementById("pointNumber").value);
    sessionStorage.setItem("SetAmount",document.getElementById("setNumber").value);
    sessionStorage.setItem("MaxDeuce",document.getElementById("MaxDeuce").value);
    sessionStorage.setItem("Deuce",document.getElementById("Deuce").checked);
}
function Umodaldisplay(bool){
    if(bool){
        document.getElementById("UploadModal").classList.add("is-active");
    }
    else{
        document.getElementById("UploadModal").classList.remove("is-active");
    }
}
function modaldisplay(bool,p1,p2,i,l){
    if(bool){
        var udrawList=sessionStorage.getItem("udrawList").split(",");
        udrawList=A2A_2d(udrawList);
        var ScoreList=sessionStorage.getItem("ScoreList").split(",");
        ScoreList=A2A_2d(ScoreList);
        document.getElementById("SFp1_input").value=document.getElementById("P1Score"+i+','+l).innerText;
        document.getElementById("SFp2_input").value=document.getElementById("P2Score"+i+','+l+1).innerText;
        document.getElementById("scoremodal").classList.add("is-active");
        document.getElementById("SFp1").innerText="Score for "+p1;
        document.getElementById("SFp2").innerText="Score for "+p2;
        document.getElementById("p1").innerText=p1;
        document.getElementById("p2").innerText=p2;
        document.getElementById("SC").onclick=function(){
            ScoreList[i][l]=document.getElementById("SFp1_input").value;
            ScoreList[i][l+1]=document.getElementById("SFp2_input").value;
            sessionStorage.setItem("ScoreList",ScoreList);
            if(document.getElementById("winnerSelect").value=="1"){    
                udrawList[i+1][l/2]=udrawList[i][l];
            }
            if(document.getElementById("winnerSelect").value=="2"){
                udrawList[i+1][l/2]=udrawList[i][l+1];
            }
            if(document.getElementById("winnerSelect").value=="3"){
                udrawList[i+1][l/2]="to be confirm";
            }
            sessionStorage.setItem("udrawList",udrawList);
            if(sessionStorage.getItem("drawUpdate")=="true"){
                changeOLD(sessionStorage.getItem("DrawName"));
            }
            modaldisplay(false);
            dP(0);
        };
    }
    else{
        document.getElementById("scoremodal").classList.remove("is-active");
    }
    
}
function SSUpdate(item){
    var running=true;
    var AllScore=document.getElementById("AllScore");
    AllScore.innerHTML='<button class="column button is-large is-ghost has-text-weight-bold">0 : 0</button>';
    if(sessionStorage.getItem("ScoreSequence")==""){
        var ScoreSequence=[];
    }
    else{
        var ScoreSequence=sessionStorage.getItem("ScoreSequence").split(",").map(i=>parseInt(i));
    } 
    if(item=="recall"){
        ScoreSequence.pop();
        if(sessionStorage.getItem("gamewon")=="true"){
            undowin(parseInt(sessionStorage.getItem("winner")));
        }
    }
    else if(item=="pass"){

    }
    else{
        ScoreSequence.push(item);
    }
    var t1score=0,t2score=0;t1set=0,t2set=0;
    var  SetScore=parseInt(sessionStorage.getItem("SetScore")),SetAmount=parseInt(sessionStorage.getItem("SetAmount")),MaxDeuce=parseInt(sessionStorage.getItem("MaxDeuce")),Deuce=sessionStorage.getItem("Deuce"); 
    var currentSet="0 : 0";
    document.getElementById("ScoreSequence").innerHTML="";
    for(var i=0;i<ScoreSequence.length;i++){
        if(ScoreSequence[i]==1){
            t1score++;
            document.getElementById("ScoreSequence").innerHTML+='<button class="button has-background-info">'+(t1score)+'</button>';       
        }
        else{
            t2score++;
            document.getElementById("ScoreSequence").innerHTML+='<button class="button has-background-danger">'+(t2score)+'</button>';           
        }
        if(t1score>=SetScore&&(Deuce=="false"||(t1score>=t2score+2||t1score>=MaxDeuce))){
            document.getElementById("ScoreSequence").innerHTML+='<button class="button">Set</button>';
            currentSet=t1score+" : "+t2score;
            t1score=0;
            t2score=0;
            t1set++;
            AllScore.lastElementChild.innerHTML=currentSet;
            var ns=document.createElement("button");
            ns.className="column button is-large is-ghost has-text-weight-bold";
            ns.innerText="0 : 0";
            AllScore.appendChild(ns);
        }
        if(t2score>=SetScore&&(Deuce=="false"||(t2score>=t1score+2||t2score>=MaxDeuce))){
            document.getElementById("ScoreSequence").innerHTML+='<button class="button">Set</button>';
            currentSet=t1score+" : "+t2score;
            t1score=0;
            t2score=0;
            t2set++;
            AllScore.lastElementChild.innerHTML=currentSet;
            var ns=document.createElement("button");
            ns.className="column button is-large is-ghost has-text-weight-bold";
            ns.innerText="0 : 0";
            AllScore.appendChild(ns);
        }
        if(t1set>SetAmount/2){
            AllScore.lastElementChild.remove();
            win(1);
            running=false;
        }
        if(t2set>SetAmount/2){
            AllScore.lastElementChild.remove();
            win(2);
            running=false;
        }
        if(t1set==t2set&&t1set+t2set==SetAmount){
            AllScore.lastElementChild.remove();
            win(0);
            running=false;
        }
        if(running){
            currentSet=t1score+" : "+t2score;
            AllScore.lastElementChild.innerText=currentSet;
        }
        

    }
    if(running){
        document.getElementById("ScoreText").innerHTML=t1score+"&nbsp;&nbsp;&nbsp;&nbsp;V&nbsp;&nbsp;&nbsp;&nbsp;"+t2score;
    }
    sessionStorage.setItem("ScoreSequence",ScoreSequence);
   
}
function ErrorCount(x){
    if(x==1){
        Team1Error=parseInt(sessionStorage.getItem("Team1Error"))+1;
        document.getElementById("t1e").innerText="Team 1 Unforce Error: "+Team1Error;
        sessionStorage.setItem("Team1Error",Team1Error);
    }
    else{
        Team2Error=parseInt(sessionStorage.getItem("Team2Error"))+1;
        sessionStorage.setItem("Team2Error",Team2Error);
        document.getElementById("t2e").innerText="Team 2 Unforce Error: "+Team2Error;
    }
}

function win(x){
    sessionStorage.setItem("winner",x);
    if(x==1){
        Array.from(document.getElementsByClassName("team1")).forEach(e=>{e.classList.add("has-text-success","has-text-weight-bold")});
    }
    if(x==2){
        Array.from(document.getElementsByClassName("team2")).forEach(e=>{e.classList.add("has-text-success","has-text-weight-bold")});
    }
    document.getElementById("ScoreSequence").innerHTML+='<button class="button">Match</button>';
    sessionStorage.setItem("gamewon","true");
    var es=document.getElementsByClassName("needhide");
    Array.from(es).forEach(e=>{e.hidden=true});
    document.getElementById("ScoreText").innerHTML=t1set+"&nbsp;&nbsp;&nbsp;&nbsp;V&nbsp;&nbsp;&nbsp;&nbsp;"+t2set;
}

function undowin(x){
    sessionStorage.setItem("gamewon","false");
    sessionStorage.setItem("winner","0");
    var es=document.getElementsByClassName("needhide");
    Array.from(es).forEach(e=>{e.hidden=false});
    if(x==1){
        Array.from(document.getElementsByClassName("team1")).forEach(e=>{e.classList.remove("has-text-success","has-text-weight-bold")});
    }
    if(x==2){
        Array.from(document.getElementsByClassName("team2")).forEach(e=>{e.classList.remove("has-text-success","has-text-weight-bold")});
    }
}

function StartMatch(element){
    var sds=document.getElementsByClassName("sd"),matchtime=0;
    Array.from(sds).forEach(sd=>{sd.hidden=false});
    document.getElementById("SMdiv").hidden=true;
    const StartTime = new Date().getTime();
    setInterval(()=>{if(sessionStorage.getItem("gamewon")=="false"){document.getElementById("MatchDuration").innerText=ctime(Math.floor((new Date().getTime()-StartTime)/1000));}},1000);
}
function ctime(second){
    var hour=0,min=0,time="";
    min=Math.floor(second/60);
    second=second-min*60;
    hour=Math.floor(min/60);
    min=min-hour*60;
    time=hour+":";
    if(min<10){
        time+="0";
    }
    time+=min+":";
    if(second<10){
        time+="0";
    }
    time+=second;
    return time;
}
function UpdatePlayerName(){
    document.getElementById("PA1").innerText=document.getElementById("PlayerA1").value;
    document.getElementById("PB1").innerText=document.getElementById("PlayerB1").value;
    if(sessionStorage.getItem("GameType")=="doubles"){
        document.getElementById("PA2").innerText=document.getElementById("PlayerA2").value;
        document.getElementById("PB2").innerText=document.getElementById("PlayerB2").value;
    }
}

function UpdateGameType(){
  var GT=document.getElementById("GameType").value;
  if(GT=="Doubles"){
      sessionStorage.setItem("GameType","doubles");
      document.getElementById("team1").innerHTML+='<h2 class="box subtitle team1" id="PA2">Player A2</h2>';
      document.getElementById("team2").innerHTML+='<h2 class="box subtitle team2" id="PB2">Player B2</h2>';
      document.getElementById("ScoreText").classList.add("mt-6");
  }
  if(GT=="Singles"){
    sessionStorage.setItem("GameType","singles");
    document.getElementById("team1").innerHTML='<h2 class="box subtitle team1" id="PA1">Player A1</h2>';
    document.getElementById("team2").innerHTML='<h2 class="box subtitle team2" id="PB1">Player B1</h2>';
    document.getElementById("ScoreText").classList.remove("mt-6");
  }
  UpdatePlayerName();
  x=sessionStorage.getItem("winner");
    if(x=='1'){
        Array.from(document.getElementsByClassName("team1")).forEach(e=>{e.classList.add("has-text-success","has-text-weight-bold")});
    }
    if(x=='2'){
        Array.from(document.getElementsByClassName("team2")).forEach(e=>{e.classList.add("has-text-success","has-text-weight-bold")});
    }
    
}
function tab_draw(){
    document.getElementById("drawcontent").hidden=false;
    document.getElementById("matchcontent").hidden=true;
    document.getElementById("tabdraw").classList.add("is-active");
    document.getElementById("tabmatch").classList.remove("is-active");
}
function tab_match(){
    document.getElementById("drawcontent").hidden=true;
    document.getElementById("matchcontent").hidden=false;
    document.getElementById("tabdraw").classList.remove("is-active");
    document.getElementById("tabmatch").classList.add("is-active");
}
function UpdateDraw(){
    var i=parseInt(sessionStorage.getItem("i"));
    var l=parseInt(sessionStorage.getItem("l"));
    var udrawList=sessionStorage.getItem("udrawList").split(',');
    udrawList=A2A_2d(udrawList);
    var ScoreList=sessionStorage.getItem("ScoreList").split(',');
    ScoreList=A2A_2d(ScoreList);
    var P1S="";
    var P2S="";
    for(var x=0;x<document.getElementById("AllScore").innerText.split("\n").length;x++){
        P1S+=document.getElementById("AllScore").innerText.split("\n")[x].split(":")[0].trim()+" ";
        P2S+=document.getElementById("AllScore").innerText.split("\n")[x].split(":")[1].trim()+" ";
    }
    if(sessionStorage.getItem("winner")=="0"){
        udrawList[i+1][l/2]="to be confirm";
    }
    if(sessionStorage.getItem("winner")=="1"){
        udrawList[i+1][l/2]=udrawList[i][l];
    }
    if(sessionStorage.getItem("winner")=="2"){
        udrawList[i+1][l/2]=udrawList[i][l+1];
    }
    ScoreList[i][l]=P1S;
    ScoreList[i][l+1]=P2S;
    sessionStorage.setItem("ScoreList",ScoreList);
    sessionStorage.setItem("udrawList",udrawList);
    if(sessionStorage.getItem("drawUpdate")=="true"){
        changeOLD(sessionStorage.getItem("DrawName"));
    }
    Page(sessionStorage.getItem("previousPage"));
    sessionStorage.setItem("previousPage","umpire");
}
function loadOLDraw(DrawName){
    const firebaseConfig = {
        apiKey: "AIzaSyC4Lz707vDHufm0U2HDxqiKgwa9NyC71Ys",
        authDomain: "yr9-dgt-tournament-manager.firebaseapp.com",
        databaseURL: "https://yr9-dgt-tournament-manager-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "yr9-dgt-tournament-manager",
        storageBucket: "yr9-dgt-tournament-manager.firebasestorage.app",
        messagingSenderId: "631705714704",
        appId: "1:631705714704:web:4ef203af13d70279bc8a95",
        measurementId: "G-CGBCF6XKVS"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const listRef = db.ref(DrawName); // 数组路径
    // 监听数组变化
    listRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            sessionStorage.setItem("Drawexist","true");
            sessionStorage.setItem("udrawList",data[0]);
            sessionStorage.setItem("ScoreList",data[1]);
            loadDraw(parseInt(sessionStorage.getItem("drawPage")));
            document.getElementById("urddiv").hidden=false;
        }
        else{
            sessionStorage.setItem("Drawexist","false");
            document.getElementById("urddiv").hidden=true;
            Umodaldisplay(true);
        }
    });
}
function watchAllDataNames() {
    const firebaseConfig = {
        apiKey: "AIzaSyC4Lz707vDHufm0U2HDxqiKgwa9NyC71Ys",
        authDomain: "yr9-dgt-tournament-manager.firebaseapp.com",
        databaseURL: "https://yr9-dgt-tournament-manager-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "yr9-dgt-tournament-manager",
        storageBucket: "yr9-dgt-tournament-manager.firebasestorage.app",
        messagingSenderId: "631705714704",
        appId: "1:631705714704:web:4ef203af13d70279bc8a95",
        measurementId: "G-CGBCF6XKVS"
    };
    
    // 检查是否已经初始化过Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const db = firebase.database();
    const rootRef = db.ref('/');
    
    // 使用 on() 方法实时监听变化
    document.getElementById("DrawOptions").innerHTML='';
    rootRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            const dataNames = Object.keys(data);
            dataNames.forEach(e=>document.getElementById("DrawOptions").innerHTML+="<option>"+e+"</option>");
        }
    }, error => {
        console.error('监听数据变化时出错:', error);
    });
}

function changeOLD(DrawName){
    const firebaseConfig = {
        apiKey: "AIzaSyC4Lz707vDHufm0U2HDxqiKgwa9NyC71Ys",
        authDomain: "yr9-dgt-tournament-manager.firebaseapp.com",
        databaseURL: "https://yr9-dgt-tournament-manager-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "yr9-dgt-tournament-manager",
        storageBucket: "yr9-dgt-tournament-manager.firebasestorage.app",
        messagingSenderId: "631705714704",
        appId: "1:631705714704:web:4ef203af13d70279bc8a95",
        measurementId: "G-CGBCF6XKVS"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const listRef = db.ref(DrawName); // 数组路径
    var udrawList=sessionStorage.getItem("udrawList").split(',');
    udrawList=A2A_2d(udrawList);
    var ScoreList=sessionStorage.getItem("ScoreList").split(',');
    ScoreList=A2A_2d(ScoreList);
    listRef.set([udrawList,ScoreList]); // 设置为空数组

}
function rtDraw(){
    changeOLD(document.getElementById('DN').value);
    sessionStorage.setItem("DrawName",document.getElementById('DN').value);
    Umodaldisplay(false);
    document.getElementById('toggleDraw').classList.remove('is-success');
    document.getElementById('toggleDraw').classList.remove('fa-play');
    document.getElementById('toggleDraw').classList.add('is-danger');
    document.getElementById('toggleDraw').classList.add('fa-stop');
    document.getElementById('Dbutton').disabled=true;
    document.getElementById('toggleDraw').onclick=function(){
        sessionStorage.setItem("drawUpdate",false);
        document.getElementById('toggleDraw').classList.add('is-success');
        document.getElementById('toggleDraw').classList.add('fa-play');
        document.getElementById('toggleDraw').classList.remove('is-danger');
        document.getElementById('toggleDraw').classList.remove('fa-stop');
        document.getElementById('Dbutton').disabled=false;
        document.getElementById("toggleDraw").onclick=()=>Umodaldisplay(true);

    };
    sessionStorage.setItem("drawUpdate",true);
    const firebaseConfig = {
        apiKey: "AIzaSyC4Lz707vDHufm0U2HDxqiKgwa9NyC71Ys",
        authDomain: "yr9-dgt-tournament-manager.firebaseapp.com",
        databaseURL: "https://yr9-dgt-tournament-manager-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "yr9-dgt-tournament-manager",
        storageBucket: "yr9-dgt-tournament-manager.firebasestorage.app",
        messagingSenderId: "631705714704",
        appId: "1:631705714704:web:4ef203af13d70279bc8a95",
        measurementId: "G-CGBCF6XKVS"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const listRef = db.ref(sessionStorage.getItem("DrawName")); // 数组路径
    // 监听数组变化
    listRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            sessionStorage.setItem("Drawexist","true");
            sessionStorage.setItem("udrawList",data[0]);
            sessionStorage.setItem("ScoreList",data[1]);
            loadDraw(parseInt(sessionStorage.getItem("drawPage")));
            console.log(data);
        }
        else{
            sessionStorage.setItem("Drawexist","false");
            Umodaldisplay(true);
        }
    });
}

function urdfunction(){
    changeOLD(sessionStorage.getItem("DrawName"));
    document.getElementById('urd').classList.remove('is-success');
    document.getElementById('urd').classList.remove('fa-play');
    document.getElementById('urd').classList.add('is-danger');
    document.getElementById('urd').classList.add('fa-stop');
    document.getElementById('urd').onclick=function(){
        sessionStorage.setItem("drawUpdate",false);
        document.getElementById('urd').classList.add('is-success');
        document.getElementById('urd').classList.add('fa-play');
        document.getElementById('urd').classList.remove('is-danger');
        document.getElementById('urd').classList.remove('fa-stop');
        document.getElementById("urd").onclick=urdfunction;

    };
    sessionStorage.setItem("drawUpdate",true);
}