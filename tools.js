var ID = "";
var APIKEY = "ef97109d-5c86-4467-a021-45c4d36fdf86";//"a202172b-de9e-497e-b13d-a0600e839d90";
var champs = {};
var summonerLevel = 0;
var summonerID = 0;
var numRecords = 0;

function summonerLookUp( ID) {
	$.ajax({
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function (json) {
			var userID = ID.replace(" ","").toLowerCase().trim();
			
			summonerLevel = json[userID].summonerLevel;
			summonerID = json[userID].id;
			return summonerID;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	});
}

function getMasteries() {
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	$.when($.ajax({ //wait for response summoner
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function (json) {
			var userID = ID.replace(" ","").toLowerCase().trim();
			
			summonerLevel = json[userID].summonerLevel;
			summonerID = json[userID].id;
			return summonerID;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			removeLoadSpinner();
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	})).done( function(){ //retrieve masteries
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
		);
}

var filter = "";
function getMatchHistory(queue){
	switch(queue){
		case 'fives': filter = "RANKED_TEAM_5x5"; break;
		case 'threes': filter = "RANKED_TEAM_3x3";break;
		case 'solo': filter = "RANKED_SOLO_5x5";break;
		case 'all': break;
	}
	
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	$.when($.ajax({ //wait for response summoner
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function (json) {
			var userID = ID.replace(" ","").toLowerCase().trim();
			
			summonerLevel = json[userID].summonerLevel;
			summonerID = json[userID].id;
			return summonerID;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			removeLoadSpinner();
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	})).done( function(){ //summoner match history
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
	}});
}

//load spinner
function addLoadSpinner(){
	$('#overlay').remove();
	$("#center").append("<div id='overlay'><img src='loading.gif'></div>");

}

function removeLoadSpinner(){
	$('#overlay').remove();
}

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

function showMatchHistory(){
	 $(document).ready(function() {
	 $.ajax({
            url : "matchhistory.html",
			async: false,
			dataType: 'html',
			data: {
			
			},
            success : function (data) {
				$('#center').html(data);
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
				$('#center').html(data);
            },
			error:function (){
				alert("error: could not load masteries html");
			}
        });
	 });
}

function mhRunScript(e) {
    if (e.keyCode == 13) {
		getMatchHistory('all');
    }
}

function loadMore(){
	addLoadSpinner();
	ID = document.getElementById("userName").value;
	$.when($.ajax({ //wait for response summoner
		url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
		type: 'GET',
		dataType: 'json',
		data: {

		},
		success: function (json) {
			var userID = ID.replace(" ","").toLowerCase().trim();
			
			summonerLevel = json[userID].summonerLevel;
			summonerID = json[userID].id;
			return summonerID;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			removeLoadSpinner();
			window.alert("Sorry we had trouble finding the entered summoner name!\n"+errorThrown);
		}
	})).done( function(){
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
	}});
}

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