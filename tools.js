var ID = "";
var APIKEY = "ef97109d-5c86-4467-a021-45c4d36fdf86";//"a202172b-de9e-497e-b13d-a0600e839d90";
var champs = {};
var champnames = {};
var numRecords = 0;
var filter = "";

/*
Retrieve Basic Player Info
*/
function summonerLookUp( ID) {
	var summonerID = 0;
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
		type: 'GET',
		dataType: 'json',
		async: false,
		data: {

		},
		success: function (json) {
			var userID = ID.replace(" ","").toLowerCase().trim();
			

			summonerID = json[userID].id;
			
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	});
	return summonerID;
}

/*
current game
*/
function getCurrentGameInfo(){
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
				
				temp = compilePlayerData(players);

				document.getElementById("currentGameInfo").innerHTML = temp;
				removeLoadSpinner();
			},

			error: function (XMLHttpRequest, textStatus, errorThrown) {
				
				alert("Error getting current game info! ");
				removeLoadSpinner();
			}
		});
	}
}

/*
Parameters:
temp - String to append data to
players - Participants JSON Object
*/
function compilePlayerData(players) {
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
	temp = temp+ sTeam1 + sTeam2 +"</table>";
	return temp;
}

function compileTeamData(s,player){
	s = s + "<td>"+player.spell1Id+" :Spell1<br>"
	+player.spell2Id+" :Spell2<br>"
	+"<a class='champion-portrait' style='background-image:url(images/champions/"+getChampionNameById(player.championId)+"_0.jpg)'>"
	+player.summonerName+"</a></td>";
	
	return s;
}

/*
Retrieve Player Masteries
*/
function getMasteries() {
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	var summonerID = summonerLookUp(ID);
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v1.4/summoner/" + summonerID + "/masteries?api_key=" + APIKEY,
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



/*
Retrieve 10 Match History records.
Parameters:
queue - RANKED_SOLO_5x5, RANKED_TEAM_3x3, RANKED_TEAM_5x5 or empty for all.
*/
function getMatchHistory(queue){
	switch(queue){
		case 'fives': filter = "RANKED_TEAM_5x5"; break;
		case 'threes': filter = "RANKED_TEAM_3x3";break;
		case 'solo': filter = "RANKED_SOLO_5x5";break;
		default: filter = ""; break;
	}
	
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	var summonerID = summonerLookUp(ID);
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + APIKEY,
			type: 'GET',
			dataType: 'json',
			data: {
				'rankedQueues':filter
			},
			success:function (resp){
				matches =resp['matches'];
				document.getElementById("matchesAll").innerHTML = "";
				document.getElementById("load-more").innerHTML = '<br><br><a href="#newData" onclick="loadMore();" id="button-load-more" class="m-h-load-more-box"><h5>LOAD MORE</h5></a>';
				var temp = "";
				matches.forEach(function (match) {
						temp = compileMatchData(temp,match);
						});
				document.getElementById("matchesAll").innerHTML = temp + "<div id='newData' name='newData'></div>";
				removeLoadSpinner();
				numRecords = 10;
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				removeLoadSpinner();
				alert("error getting match history");
				
			}
		});
	}

}

/*
Retrieve Additional 10 Match History records appended to previous results.
*/
function loadMore(){
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	var summonerID = summonerLookUp(ID);
	if (summonerID != 0){
		$.ajax({
			url: "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/"+summonerID+"?api_key=" + APIKEY,
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


/*
Parameters:
temp - String to append data to
match - Match JSON Object
*/
function compileMatchData(temp,match) {
	var stats = match.participants[0].stats;
	var num = getChampionIconById(match.participants[0].championId);
	var size = 48;
	var page = Math.floor(num/30);
	var row = Math.floor((num%30)/10)*size;
	var col = (num%10)*size;
	temp = 
	"<tr><td style='width:100px'>"+
		"<a class='champion-icon' style='background-image:url(images/champion"+page+".png);background-position:-"+col+"px -"+row+"px;'></a>"+
		"<br>ChampionId: " + match.participants[0].championId + 
	"</td><td>"+
		"Match ID: "+match.matchId + 
		"<br>Queue Type: "+match.queueType+ 
		"<br>MapId: "+ match.mapId+ 
		"<br>KDA: " + stats.kills +"/" +stats.deaths+"/"+stats.assists +
	"</td></tr>"+ temp;
	return temp;
}

/*
Add Load spinner
*/
function addLoadSpinner(){
	$('#overlay').remove();
	$("#center").append("<div id='overlay' ><img src='loading.gif' ></div>");

}

/*
Remove Load spinner
*/
function removeLoadSpinner(){
	$('#overlay').remove();
}

/*
Image Icons. Setup champion ids  to match image resources.
*/
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
		champs[62] = page*2 + 1; //wukong
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
		champnames[4] = "twistedfate";
		champnames[5] = "xinzhao";
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
		champnames[21] = "missfortune";
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
		champnames[62] = "wukong";
		champnames[63] = "brand";
		champnames[64] = "leesin";
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
		champnames[96] = "kogmaw";
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
		champnames[421] = "reksai";
		champnames[429] = "kalista";
		champnames[432] = "bard";
	}
	return champnames[ID];
}

function getSummonerSkillIconById(ID){
	if (summonerskills[1] === undefined){
		summonerskills[4] = "smite";
		summonerskills[7] = "heal";
		summonerskills[3] = "exhaust";
		summonerskills[12] = "teleport";
		summonerskills[11] = "smite";
	}
	return summonerskills[ID];
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
				$('#center').html(data);
            },
			error:function (){
				alert("error: could not load match history html");
			}
        });
	 });
}

/*
Match History search on Enter key
*/
function mhRunScript(e) {
    if (e.keyCode == 13) {
		getMatchHistory('all');
    }
}

/*
Dynamic: show Masteries page
*/
function showMasteries(){
	$(document).ready(function() {
	 $.ajax({
            url : "masteries.html",
			async: false,
			dataType: 'html',
			data: {
			
			},
            success : function (data) {
				$('#center').html(data);
            },
			error:function (){
				alert("error: could not load masteries html");
			}
        });
	 });
}

/*
Dynamic: show Current Game page
*/
function showCurrentGame(){
	$(document).ready(function() {
	 $.ajax({
            url : "currentgame.html",
			async: false,
			dataType: 'html',
			data: {
			
			},
            success : function (data) {
				$('#center').html(data);
            },
			error:function (){
				alert("error: could not load masteries html");
			}
        });
	 });
}

/*
current game on enter key
*/
function cgRunScript(e) {

    if (e.keyCode == 13) {
		getCurrentGameInfo();
    }
}