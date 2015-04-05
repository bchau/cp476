var ID = "";
var APIKEY = "a202172b-de9e-497e-b13d-a0600e839d90"; //"ef97109d-5c86-4467-a021-45c4d36fdf86"
var champs = {};
var champnames = {};
var summonerskills = {};
var mapnames = {};
var mapimages = {};
var gamemode ={};
var numRecords = 0;
var filter = "";
var keyCount = 0;
var mode = "cg";
var cgID = "";
var cgName = "";

//bypass api key restrictions (temporary)
function getAPIKey(){
	var result = "";
	switch(keyCount){
		case 0: result = "a202172b-de9e-497e-b13d-a0600e839d90"; break;
		case 1: result = "ef97109d-5c86-4467-a021-45c4d36fdf86"; break;
		case 2: result = "c9906c39-e8bf-4499-bc13-9b27431d1379"; break;
		case 3: result = "cc758690-fdd7-49b8-9f31-6ea3a6a167f9"; break;
		case 4: result = "673e2d9b-e252-4416-b0d5-79f7fc29ebc0"; break;
	}
	keyCount = (keyCount+1)%5;
	return result;
}

//find summoner basic info
function summonerLookUp( ID) {
	var summonerID = 0;
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + getAPIKey(),
		type: 'GET',
		dataType: 'json',
		async: false,
		data: {

		},
		success: function (json) {
			var userID = replaceAll(" ","",ID).toLowerCase().trim();
			

			summonerID = json[userID].id;
			
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	});
	return summonerID;
}

//get current game info
function getCurrentGameInfo(){
	if(mode =="cg"){
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	var summonerID = summonerLookUp(ID);
	if (summonerID != 0){
		$.ajax({
			url: "getCurrentGame.php?summonerID="+summonerID,
			type: 'POST',
			dataType: 'json',
			data: {
			},
			success: function (resp) {
				players =resp['participants'];
				document.getElementById("currentGameInfo").innerHTML = "";
				
				temp = compileGameData(resp) + compilePlayerData(resp);

				document.getElementById("currentGameInfo").innerHTML = temp;
				removeLoadSpinner();
			},

			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
				alert("Error getting current game info! ");
				removeLoadSpinner();
			}
		});
	}else{
		removeLoadSpinner();
	}
	}
}

function compileGameData(data){
	var temp = "<div class='c-g-center'>"
	+"<div class='c-g-box'><h5>Game mode: "+getGameModeById(data.gameQueueConfigId) + "</h5></div>"
	+"<div class='c-g-box'><h5>Game type: "+data.gameType +"</h5></div>"
	+"<div class='c-g-box'><h5>Map: "+getMapNameById(data.mapId) +"</h5></div>"
	+"<div class='c-g-box' id='gameTime' startTime='"+data.gameStartTime+"'><h5>Game Time: "+ elapsedTime(data.gameStartTime) +"</h5></div></div>";
	return temp;
}


function compilePlayerData(data) {
	var players = data['participants'];
	var temp = "<table class='current-game-table'>";
	var sTeam1 = "<tr class='current-game-row'>";
	var sTeam2 = "<tr class='current-game-row'>";
	players.forEach(function (player) {
		
		if (player.teamId == 100){
			sTeam1 = compileTeamData(sTeam1,player);
		}
		else{
			sTeam2 = compileTeamData(sTeam2,player);
		}
	});
	sTeam1 = sTeam1 +"</tr>"; 
	sTeam2 = sTeam2 +"</tr>";
	
	var bans = data['bannedChampions'];
	var sBans = "<tr><td>";
	var ban1 = "";
	var ban2 = "";
	var ban3 = "";
	var ban4 = "";
	var ban5 = "";
	var ban6 = "";
	bans.forEach(function(ban){
		
		var num = getChampionIconById(ban.championId);
		var size = 48;
		var page = Math.floor(num/30);
		var row = Math.floor((num%30)/10)*size;
		var col = (num%10)*size;
			
		switch(ban.pickTurn){
			case 1: ban1 = "<a class='ban-icon blue-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			case 2: ban2 = "<a class='ban-icon purple-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			case 3: ban3 = "<a class='ban-icon blue-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			case 4: ban4 = "<a class='ban-icon purple-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			case 5: ban5 = "<a class='ban-icon blue-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			case 6: ban6 = "<a class='ban-icon purple-border' style='background-image:url(images/champion"+page
			+".png);background-position:-"+col+"px -"+row+"px;'></a>"; 
			break;
			default:
			break;
		}
	});
	var sBans = "";
	if(bans.length != 0){
		sBans = "<tr class='c-g-mid'><td class='c-g-mid-box'> BLUE SIDE BANS: <br>"+ban1+ban3+ban5
		+"</td><td class='c-g-mid-box'></td><td class='c-g-mid-box'>VS</td><td class='c-g-mid-box'></td><td class='c-g-mid-box'>"
		+"PURPLE SIDE BANS: <br>"+ban2+ban4+ban6+"</td></tr>";
	}else{
		sBans = "<tr class='c-g-mid'><td class='c-g-mid-box'>"
		+"</td><td class='c-g-mid-box'></td><td class='c-g-mid-box'>VS</td><td class='c-g-mid-box'></td><td class='c-g-mid-box'>"
		+"</td></tr>";
	}
	temp = temp+ sTeam1 +sBans+ sTeam2 +"</table>";
	return temp;
}

function compileTeamData(s,player){
	var border = "purple-border";
	if (player.teamId == 100){
		border = "blue-border";
	}
	
	s = s + "<td>"
	+"<a class='champion-portrait "+border+"' style='marginBottom:5px; background-image:url(images/champions/"+getChampionNameById(player.championId)+"_0.jpg)'>"
	+player.summonerName+"<br>"
	+"<div class='summoner-spell-icon' style='background-image:url(images/spells/"+getSummonerSkillIconById(player.spell1Id)+".png)'></div>"
	+"<br><div class='summoner-spell-icon' style='background-image:url(images/spells/"+getSummonerSkillIconById(player.spell2Id)+".png)'></div>"
	+"<br>"+getPlayerStatsChampion(player.summonerId,player.championId)
	+getPlayerStats(player.summonerId)
	+"<div href='#matchesAll' class='c-g-load-more noselect' onclick='getCurrentGamePlayersMatchHistory("
	+player.summonerId+',"'+player.summonerName+'")'+"'>LOAD<br>MORE</div>"
	+"</a></td>";
	
	return s;
}

function getPlayerStatsChampion(summonerID,championID){
	var temp = "";
	if (summonerID != 0){
		//average data on champion
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + getAPIKey(),
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {
				'championIds':""+championID
			},
			success:function (resp){
				matches =resp['matches'];
				
				temp = compilePlayerStatsChampion(matches);

				
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				alert("error getting match history");
				
			}
		});
	}
	return temp;
}


function compilePlayerStatsChampion(matches){
	if (matches === undefined){
		return "<div class='c-g-info-box-title'>No ranked games found on this champion.</div></br>";
	}
	var kills = 0;
	var deaths = 0;
	var assists = 0;
	var cs = 0;
	
	matches.forEach(function (match) {
		var participants = match['participants'];
		var stats = participants[0]['stats'];
		kills = kills+stats.kills;
		deaths = deaths+stats.deaths;
		assists = assists+stats.assists;
		cs = cs+stats.minionsKilled;

	});
	if(matches.length != 0){
		kills = Math.floor(kills/matches.length*10)/10;
		deaths = Math.floor(deaths/matches.length*10)/10;
		assists = Math.floor(assists/matches.length*10)/10;
		cs = Math.floor(cs/matches.length*10)/10;
	}
	var result = "<div class='c-g-info-box-title'>Champ stats last "+matches.length+"</div>"
	+"<div class='c-g-info-box'>KDA: "+kills+" / "+deaths+" / "+assists +"</div>"
	+"<div class='c-g-info-box'>CS: "+cs+"</div>";
	return result;
}


function getPlayerStats(summonerID){
	var temp = "";
	if (summonerID != 0){
		//average data on player
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + getAPIKey(),
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {
			},
			success:function (resp){
				matches =resp['matches'];
				temp = compilePlayerStats(matches);
				
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				alert("error getting match history");
				
			}
		});
	}
	return temp;
}


function compilePlayerStats(matches){
	if (matches === undefined){
		return "<div class='c-g-info-box-title'>This player has not played ranked games this season.</div></br>";
	}
	var kills = 0;
	var deaths = 0;
	var assists = 0;
	var lane = {};
	lane['MID'] = 0;
	lane['BOT'] = 0;
	lane['MIDDLE'] = 0;
	lane['BOTTOM'] = 0;
	lane['TOP'] = 0;
	lane['JUNGLE'] = 0;
	matches.forEach(function (match) {
		var participants = match['participants'];
		var stats = participants[0]['stats'];
		kills = kills+stats.kills;
		deaths = deaths+stats.deaths;
		assists = assists+stats.assists;
		var timeline = participants[0].timeline;
		lane[timeline.lane] += 1;
	});
	var recentLane = "MIDDLE";
	if(matches.length != 0){
		kills = Math.floor(kills/matches.length*10)/10;
		deaths = Math.floor(deaths/matches.length*10)/10;
		assists = Math.floor(assists/matches.length*10)/10;
		lane['MIDDLE'] += lane['MID'];
		lane['BOTTOM'] += lane['BOT'];
		if (lane['TOP'] > lane[recentLane]){
			recentLane = 'TOP';
		}
		else if (lane['JUNGLE'] > lane[recentLane]){
			recentLane = 'JUNGLE';
		}
		else if (lane['BOTTOM'] > lane[recentLane]){
			recentLane = 'BOTTOM';
		} 
	}
	var result = "<div class='c-g-info-box-title'>Player stats last "+matches.length+"</div>"
	+"<div class='c-g-info-box'>KDA: "+kills+" / "+deaths+" / "+assists+"</div>"
	+"<div class='c-g-info-box'>Recent Lane: "+recentLane+"</div>";
	
	//tilt check & streak
	result = result+getStreak(matches)+tiltCheck(matches);
	return result;
}

function tiltCheck(matches){
	if (matches === undefined){ return "";}
	
	var done = false;
	var index = matches.length-1;
	var feed = 0;
	while( index >= 0 && done == false){
		//check most recent game time. compare to now time.
		if (!isRecentGame(matches[index].matchCreation,6)){ //game started too long ago to be on tilt.
			done = true;
		}else{ //played recently
			var match = matches[index];
			var participant = (match['participants'])[0];
			var stats = participant['stats'];
			if (stats.deaths > stats.kills && stats.deaths > stats.assists){
				feed = feed + 1;
			}
		}
		
		index = index - 1;
	}
	if(feed >=2){
		return "<div class='warning'><div class='warning-box'>"
		+"This player has recently fed in their last "+feed
		+" games. They are likely to be on tilt."
		+"</div></div>";
	}
	return "";
}

function getStreak(matches){
	if (matches === undefined){ return "";}
	var done = false;
	var index = matches.length-1;
	
	
	var match = matches[index];
	var participant = (match['participants'])[0];
	var stats = participant['stats'];
	index = index - 1;
	var win = stats.winner;
	var streak = 1;
	
	while( index >= 0 && done == false){
		var match = matches[index];
		var participant = (match['participants'])[0];
		var stats = participant['stats'];
		if(stats.winner == win){
			streak = streak+1;
		}else{
			done = true;
		}
		index = index - 1;
	}
	
	var result = "";
	if(win == true){
		result = "<div class='text-win-streak'>"+streak + " game win streak</div>"; 
	}
	else{
		result = "<div class='text-lose-streak'>"+streak + " game lose streak</div>";
	}
	return result;

}

function isRecentGame(timeOfMatch, hours){

    var seconds = (new Date().getTime() - timeOfMatch)/1000;
    var h = Math.floor(seconds/60/60); //hours

	if (h <= hours){ //if youve played recently within the designated hours..
		return true;
	}else{
		return false;
	}
}

//gets player masteries
function getMasteries() {
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	var summonerID = summonerLookUp(ID);
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v1.4/summoner/" + summonerID + "/masteries?api_key=" + getAPIKey(),
			type: 'GET',
			dataType: 'json',
			data: {

			},
			success: function (resp) {
				numberOfPages = resp[summonerID].pages.length;            
				document.getElementById("masteryPagesCount").innerHTML = numberOfPages;
				document.getElementById("masteryPagesAll").innerHTML = "";
				resp[summonerID].pages.forEach(function (item) {
				document.getElementById("masteryPagesAll").innerHTML = document.getElementById("masteryPagesAll").innerHTML + item.name + "<br />";
				});
				
				removeLoadSpinner();
			},

			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
				alert("error getting Summoner data2!");
				removeLoadSpinner();
			}
		});
	}
		
}


//gets match history
function getMatchHistory(queue, override){
	if(mode == "mh" || override == true){
	switch(queue){
		case 'fives': filter = "RANKED_TEAM_5x5"; break;
		case 'threes': filter = "RANKED_TEAM_3x3";break;
		case 'solo': filter = "RANKED_SOLO_5x5";break;
		default: filter = ""; break;
	}
	
	
	addLoadSpinner();
	var summonerID = "";
	var loadMoreOverride = "";
	var displayName = "";
	if(override == true){
		summonerID = cgID;
		loadMoreOverride = "true";
		displayName = cgName;
	}
	else{
		ID = document.getElementById("userName").value;
		summonerID = summonerLookUp(ID);
		displayName = ID;
	}
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + getAPIKey(),
			type: 'GET',
			dataType: 'json',
			data: {
				'rankedQueues':filter,
			},
			success:function (resp){
				matches =resp['matches'];
				document.getElementById("label-summoner-name").innerHTML = "Results for summoner: "+displayName;
				document.getElementById("matchesAll").innerHTML = "";
				document.getElementById("load-more").innerHTML = '<br><br><a href="#newData" onclick="loadMore('+loadMoreOverride+');" id="button-load-more" class="m-h-load-more-box"><h5>LOAD MORE</h5></a>';
				var temp = "";
				if (matches != undefined){
					matches.forEach(function (match) {
							temp = compileMatchData(temp,match);
							});
					document.getElementById("matchesAll").innerHTML = temp + "<div id='newData' name='newData'></div>";
				}
				removeLoadSpinner();
				numRecords = 10;
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				removeLoadSpinner();
				alert("error getting match history");
				
			}
		});
	}else{
		removeLoadSpinner();
	}
	}
}

function loadMore(override){
	addLoadSpinner();
	var summonerID = "";
	if(override == true){
		summonerID = cgID;
	}else{
		ID = document.getElementById("userName").value;
		summonerID = summonerLookUp(ID);
	}
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + getAPIKey(),
			type: 'GET',
			dataType: 'json',
			data: {
				'rankedQueues':filter, //previously selected
				'beginIndex' :numRecords,
				'endIndex':numRecords+9
			},
			success:function (resp){
				matches =resp['matches'];
				var temp = "";
				$('#newData').remove();
				matches.forEach(function(match){temp = compileMatchData(temp,match);});
				document.getElementById("matchesAll").innerHTML = document.getElementById("matchesAll").innerHTML + temp + "<div id='newData' name='newData'></div>"; //properly append new data
				removeLoadSpinner();
				numRecords = numRecords+10;
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				removeLoadSpinner();
				alert("error getting match history");
				
			}
		});
	}
}

function compileMatchData(temp,match) {
	var stats = match.participants[0].stats;
	var num = getChampionIconById(match.participants[0].championId);
	var size = 48;
	var page = Math.floor(num/30);
	var row = Math.floor((num%30)/10)*size;
	var col = (num%10)*size;
	
	var tdStyle = "m-h-win-box";
	if (!stats.winner){
		tdStyle = "m-h-lose-box";
	}
	temp = 
	"<tr><td class='m-h-icon-box' style='width:100px'>"+
		"<a class='champion-icon' style='background-image:url(images/champion"+page+".png);background-position:-"+col+"px -"+row+"px;'></a>"+ 
	"</td><td class='"+tdStyle+"'>"
		+"<div class='m-h-info-box' style='background-image:url("
		+getMapImageById(match.mapId)+".png); background-repeat: no-repeat;' >"
		+"<h4>"+getMapNameById(match.mapId)+ "</h4></div>"
		+"<div class='m-h-info-box'><h4>"+match.season+ "</h4></div>"
		+"<div class='m-h-info-box'><h4>"+match.queueType+ "</h4></div>"
		+"<div class='m-h-info-box'><h4>KDA: " + stats.kills +" / " +stats.deaths+" / "+stats.assists + "</h4></div>"
	+"</td></tr>"+ temp;
	return temp;
}

//load spinners

function addLoadSpinner(){
	$('#overlay').remove();
	$("#output").append("<div id='overlay' ><img src='images/loading.gif' ></div>");

}

function removeLoadSpinner(){
	$('#overlay').remove();
}

//Retrieve By Id functions
function getChampionIconById(ID){
	if (champs[1] === undefined){
		var page = 30;
		champs[1] = 6; //annie
		champs[2] = page*2+10; //olaf
		champs[3] = 26; //galio
		champs[4] = page*3 + 11; //twisted fate
		champs[5] = page*3 + 25; // xinzhao
		champs[6] = page*3 + 14; //urgot
		champs[7] = page*1 + 19; // leblanc
		champs[8] = page*3 +  21; // vladimir
		champs[9] = 23; //fiddlesticks
		champs[10] = page*1 + 15; //kayle
		champs[11] = page*1 + 29; // master yi
		champs[12] = 3; //alistar
		champs[13] = page*2 + 21; // ryze
		champs[14] = page*2 + 27; //sion
		champs[15] = page*2 + 28; //sivir
		champs[16] = page*3 + 1; //soraka
		champs[17] = page*3 + 6; // teemo
		champs[18] = page*3 + 8; // tristana
		champs[19] = page*3 + 23; // warwick
		champs[20] = page*2 + 9; //nunu
		champs[21] = page*2 + 0; //miss fortune
		champs[22] = 7; //ashe
		champs[23] = page*3 + 10; // tryndamere
		champs[24] = page*1 + 7; //jax
		champs[25] = page*2 + 3; //morgana
		champs[26] = page*4 + 1; // zilean
		champs[27] = page*2 + 26; // singed
		champs[28] = 21; //evelynn
		champs[29] = page*3 + 12; // twitch
		champs[30] = page*1 + 12; //karthus
		champs[31] = 14; //chogath
		champs[32] = 4; //amumu
		champs[33] = 15; // rammus
		champs[34] = 5; //anivia
		champs[35] = page*2 + 23; // shaco
		champs[36] = 19; //Dr.Mundo
		champs[37] = page*3 + 0; // sona 
		champs[38] = page*1 + 13; // kassadin
		champs[39] = page*1 + 4; //irelia
		champs[40] = page*1 + 5; // janna
		champs[41] = 27; //gangplank
		champs[42] = 15; //corki
		champs[43] = page*1 + 11; // karma
		champs[44] = page*3 + 5; // taric
		champs[45] = page*3 + 17; // veigar
		champs[48] = page*3 + 9; //trundle
		champs[50] = page*3 + 2; //swain
		champs[51] = 12; //caitlyn
		champs[53] = 9; //blitzcrank
		champs[54] = page*1 + 26; // malphite
		champs[55] = page*1 + 14; // katarina
		champs[56] = page*2 + 8; // nocturne
		champs[57] = page*1 + 28; // maokai
		champs[58] = page*2 + 17; // renekton
		champs[59] = page*1 + 6; //jarvanIV
		champs[60] = 20; //elise
		champs[61] = page*2 + 11; // orianna
		champs[62] = page*2 + 1; //wukong / monkeyKing
		champs[63] = 10; //brand
		champs[64] = page*1 + 20; //leesin
		champs[67] = page*3 + 16; // vayne
		champs[68] = page*2 + 20; //rumble
		champs[69] = 13; //cassiopeia
		champs[72] = page*2 + 29; // skarner
		champs[74] = page*1 + 3; //heimerdinger
		champs[75] = page*2 + 5; // nasus
		champs[76] = page*2 + 7; // nidalee
		champs[77] = page*3 + 13; // udyr
		champs[78] = page*2 + 13; // poppy
		champs[79] = page*1 + 0; //gragas
		champs[80] = page*2 + 12; // pantheon
		champs[81] = 22; //ezreal
		champs[82] = page*2 + 2; //mordekaiser
		champs[83] = page*3 + 7; //yorick
		champs[84] = 2; //akali
		champs[85] = page*1 + 16;
		champs[86] = 28; //garen
		champs[89] = page*1 + 21; //leona
		champs[90] = page*1 + 27; // malzahar
		champs[91] = page*3 + 4; //talon
		champs[92] = page*2 + 19; // riven
		champs[96] = page*1 + 18; //kogmaw
		champs[98] = page*2 + 24; // shen
		champs[99] = page*1 + 25; // lux
		champs[101] = page*3 + 24; // xerath
		champs[102] = page*2 + 25; //shyvana
		champs[103] = 1; //ahri
		champs[104] = page*1 + 1; //graves
		champs[105] = 25; //fizz
		champs[106] = page*3 + 22; // volibear
		champs[107] = page*2 + 18; // rengar
		champs[110] = page*3 + 15; //varus
		champs[111] = page*2 + 6; // nautilus
		champs[112] = page*3 + 20; // viktor
		champs[113] = page*2 + 22; //sejuani
		champs[114] = 24; //fiora
		champs[115] = page*4 + 0; // ziggs
		champs[117] = page*1 + 24; // lulu
		champs[119] = 18; //draven
		champs[120] = page*1 + 2; //hecarim
		champs[121] = page*1 + 17; //khazix
		champs[122] = 16; //darius
		champs[126] = page*1 + 8; //jayce
		champs[127] = page*1 + 22; //lissandra
		champs[133] = page*2 + 14; //quinn
		champs[134] = page*3 + 3; // syndra
		champs[131] = 17; //diana
		champs[143] = page*4 + 2; // zyra
		champs[150] = 29; //gnar
		champs[154] = page*3 + 28; // zac
		champs[157] = page*3 + 26; // yasuo
		champs[161] = page*3 + 18; //velkoz
		champs[201] = 11; //braum
		champs[222] = page*1 + 9; //jinx
		champs[236] = page*1 + 23; // lucian
		champs[238] = page*3 + 29; // zed
		champs[254] = page*3 + 19; // vi
		champs[266] = 0; //aatrox
		champs[267] = page*2 + 4; // nami
		champs[268] = 8; //azir
		champs[412] = page*3 + 7; // thresh
		champs[421] = page*2 + 16; // reksai
		champs[429] = page*1 + 10; // kalista 
		champs[432] = page*4+3; //bard
	}
	return champs[ID];
}

function getChampionNameById(ID){
	if (champnames[1] === undefined){
		champnames[1] = "annie";
		champnames[2] = "olaf";
		champnames[3] = "galio";
		champnames[4] = "TwistedFate";
		champnames[5] = "XinZhao";
		champnames[6] = "urgot";
		champnames[7] = "leblanc";
		champnames[8] = "vladimir";
		champnames[9] = "fiddlesticks";
		champnames[10] = "kayle";
		champnames[11] = "masteryi";
		champnames[12] = "alistar";
		champnames[13] = "ryze";
		champnames[14] = "sion";
		champnames[15] = "sivir";
		champnames[16] = "soraka";
		champnames[17] = "teemo";
		champnames[18] = "tristana";
		champnames[19] = "warwick";
		champnames[20] = "nunu";
		champnames[21] = "MissFortune";
		champnames[22] = "ashe";
		champnames[23] = "tryndamere";
		champnames[24] = "jax";
		champnames[25] = "morgana";
		champnames[27] = "singed";
		champnames[28] = "evelynn";
		champnames[29] = "twitch";
		champnames[30] = "karthus";
		champnames[31] = "chogath";
		champnames[32] = "amumu";
		champnames[33] = "rammus";
		champnames[34] = "anivia";
		champnames[35] = "shaco";
		champnames[36] = "DrMundo";
		champnames[37] = "sona";
		champnames[38] = "kassadin";
		champnames[39] = "irelia";
		champnames[40] = "janna";
		champnames[41] = "gangplank";
		champnames[42] = "corki";
		champnames[43] = "karma";
		champnames[44] = "taric";
		champnames[45] = "veigar";
		champnames[48] = "trundle";
		champnames[50] = "swain";
		champnames[51] = "caitlyn";
		champnames[53] = "blitzcrank";
		champnames[54] = "malphite";
		champnames[55] = "katarina";
		champnames[56] = "nocturne";
		champnames[57] = "maokai";
		champnames[58] = "renekton";
		champnames[59] = "jarvanIV";
		champnames[60] = "elise";
		champnames[61] = "orianna";
		champnames[62] = "MonkeyKing";
		champnames[63] = "brand";
		champnames[64] = "LeeSin";
		champnames[67] = "vayne";
		champnames[68] = "rumble";
		champnames[69] = "cassiopeia";
		champnames[72] = "skarner";
		champnames[74] = "heimerdinger";
		champnames[75] = "nasus";
		champnames[76] = "nidalee";
		champnames[77] = "udyr";
		champnames[78] = "poppy";
		champnames[79] = "gragas";
		champnames[80] = "pantheon";
		champnames[81] = "ezreal";
		champnames[82] = "mordekaiser";
		champnames[83] = "yorick";
		champnames[84] = "akali";
		champnames[85] = "kennen";
		champnames[86] = "garen";
		champnames[89] = "leona";
		champnames[90] = "malzahar";
		champnames[91] = "talon";
		champnames[92] = "riven";
		champnames[96] = "KogMaw";
		champnames[98] = "shen";
		champnames[99] = "lux";
		champnames[101] = "xerath";
		champnames[102] = "shyvana";
		champnames[103] = "ahri";
		champnames[104] = "graves";
		champnames[105] = "fizz";
		champnames[106] = "volibear";
		champnames[107] = "rengar";
		champnames[110] = "varus";
		champnames[111] = "nautilus";
		champnames[112] = "viktor";
		champnames[113] = "sejuani";
		champnames[114] = "fiora";
		champnames[115] = "ziggs";
		champnames[117] = "lulu";
		champnames[119] = "draven";
		champnames[120] = "hecarim";
		champnames[121] = "khazix";
		champnames[122] = "darius";
		champnames[126] = "jayce";
		champnames[127] = "lissandra";
		champnames[133] = "quinn";
		champnames[134] = "syndra";
		champnames[131] = "diana";
		champnames[143] = "zyra";
		champnames[150] = "gnar";
		champnames[154] = "zac";
		champnames[157] = "yasuo";
		champnames[161] = "velkoz";
		champnames[201] = "braum";
		champnames[222] = "jinx";
		champnames[236] = "lucian";
		champnames[238] = "zed";
		champnames[254] = "vi";
		champnames[266] = "aatrox";
		champnames[267] = "nami";
		champnames[268] = "azir";
		champnames[412] = "thresh";
		champnames[421] = "RekSai";
		champnames[429] = "kalista";
		champnames[432] = "bard";
	}
	return capitalizeFirstLetter(champnames[ID]);

}

function getSummonerSkillIconById(ID){
	if (summonerskills[1] === undefined){
		summonerskills[1] = "Boost";
		summonerskills[2] = "Clairvoyance";
		summonerskills[3] = "Exhaust";
		summonerskills[4] = "Flash";
		summonerskills[6] = "Ghost";
		summonerskills[7] = "Heal";
		summonerskills[11] = "Smite";
		summonerskills[10] = "Revive";
		summonerskills[12] = "Teleport";
		summonerskills[14] = "Ignite";
		summonerskills[17] = "Garrison";
		summonerskills[21] = "Barrier";
	}
	return summonerskills[ID];
}

function getMapNameById(ID){
	if (mapnames[1] === undefined){
		mapnames[1] = "Summoner's Rift - Original Summer Variant";
		mapnames[2]	= "Summoner's Rift - Original Autumn Variant";
		mapnames[3] = "The Proving Grounds";
		mapnames[4] = "Twisted Treeline";	
		mapnames[8] = "The Crystal Scar";	
		mapnames[10] = "Twisted Treeline";
		mapnames[11] = "Summoner's Rift";
		mapnames[12] = "Howling Abyss";
	}
	return mapnames[ID];
}

function getMapImageById(ID){
	if (mapimages[1] === undefined){
		mapimages[1] = "images/summoners_rift";
		mapimages[2] = "images/summoners_rift";
		mapimages[3] = "images/the_proving_grounds";
		mapimages[4] = "images/the_twisted_treeline";	
		mapimages[8] = "images/the_crystal_scar";	
		mapimages[10] = "images/the_twisted_treeline";
		mapimages[11] = "images/summoners_rift";
		mapimages[12] = "images/howling_abyss";
	}
	return mapimages[ID];
}

function getGameModeById(ID){
	if (gamemode[0] === undefined){
		gamemode[0] = "Custom";
		gamemode[2] = "Normal 5v5 Blind";
		gamemode[7] = "Bot 5v5";
		gamemode[31] = "Bot Intro";
		gamemode[32] = "Bot Beginner";
		gamemode[33] = "Bot Intermediate";
		gamemode[8] = "Normal 3v3";
		gamemode[14] = "Normal 5v5 Draft";
		gamemode[16] = "Dominion 5v5 Blind";
		gamemode[17] = "Dominion 5v5 Draft";
		gamemode[25] = "Dominion Coop vs AI";
		gamemode[4] = "Ranked Solo 5v5";
		gamemode[9] = "Ranked Premade 3v3";
		gamemode[6] = "Ranked Premade 5v5";
		gamemode[41] = "Ranked Team 3v3";
		gamemode[42] = "Ranked Team 5v5";
		gamemode[52] = "Bot 3v3";
		gamemode[61] = "Team Builder 5v5";
		gamemode[65] = "ARAM";
		gamemode[70] = "One for All";
		gamemode[72] = "Snowdown 1v1";
		gamemode[73] = "Snowdown 2v2";
		gamemode[75] = "Hexakill";
		gamemode[76] = "Ultra Rapid Fire";
		gamemode[83] = "Ultra Rapid Fire vs AI";
		gamemode[91] = "Doom Bots Rank 1";
		gamemode[92] = "Doom Bots Rank 2";
		gamemode[93] = "Doom Bots Rank 5";
		gamemode[96] = "Ascension";
		gamemode[98] = "Hexakill";
		gamemode[300] = "King Poro 5v5";
		gamemode[310] = "Nemesis";
	}
	return gamemode[ID];
}
/*
Dynamic: show Match History page
*/
function showMatchHistory(){
	 $(document).ready(function() {
	 $.ajax({
            url : "matchhistory.html",
			async: false,
			dataType: 'html',
			data: {},
            success : function (data) {
				$('#output').html(data);
				mode="mh";
            },
			error:function (){
				alert("error: could not load match history html");
			}
        });
	 });
}

function showMasteries(){
	$(document).ready(function() {
	 $.ajax({
            url : "masteries.html",
			async: false,
			dataType: 'html',
			data: {
			
			},
            success : function (data) {
				$('#output').html(data);
            },
			error:function (){
				alert("error: could not load masteries html");
			}
        });
	 });
}

function showCurrentGame(){
	$(document).ready(function() {
	 $.ajax({
            url : "currentgame.html",
			async: false,
			dataType: 'html',
			data: {
			
			},
            success : function (data) {
				$('#output').html(data);
				mode = "cg";
            },
			error:function (){
				alert("error: could not load masteries html");
			}
        });
	 });
}

function getCurrentGamePlayersMatchHistory(ID,name){
	//show
	$(document).ready(function() {
	 $.ajax({
            url : "matchhistory2.html",
			async: false,
			dataType: 'html',
			data: {},
            success : function (data) {
				if ( document.getElementById("matchesAll") == null){ //if it doesnt exist
					//append html
					var newcontent= document.createElement('div'); 
					newcontent.innerHTML= data; 
					
					while (newcontent.firstChild) {
						document.getElementById("output").appendChild(newcontent.firstChild);
					}
				}
				
            },
			error:function (){
				alert("error: could not load match history html");
			}
        });
	 });
	//execute
	
	cgName = name;
	cgID = ID;
	getMatchHistory("",true);
}


//Helper functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function elapsedTime (createdAt)
{
	if(createdAt == 0){
		return '--:--';
	}
    var seconds = (new Date().getTime() - createdAt)/1000;
	
    var h = Math.floor(seconds/60/60); //hours
	var n = Math.floor(seconds/60); //minutes
	var s = Math.floor(seconds%60); //seconds

	if(s < 10){
		return h*60+n + ":0" +s;
	}else{
		return h*60+n + ':' + s;
	}
}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//update every second if necessary
setInterval(function() {
	if(document.getElementById("gameTime") != null && document.getElementById("gameTime").getAttribute("startTime") != 0){
		document.getElementById("gameTime").innerHTML = "<h5>Game Time: "+ elapsedTime(Number(document.getElementById("gameTime").getAttribute("startTime"))) + "</h5>";
	}
}, 1000); 