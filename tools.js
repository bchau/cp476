var ID = "";
var APIKEY = "ef97109d-5c86-4467-a021-45c4d36fdf86";//"a202172b-de9e-497e-b13d-a0600e839d90";

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
			document.getElementById("sLevel").innerHTML = summonerLevel;
			document.getElementById("sID").innerHTML = summonerID;
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
			document.getElementById("sLevel").innerHTML = summonerLevel;
			document.getElementById("sID").innerHTML = summonerID;
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


function getMatchHistory(){
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
			document.getElementById("sLevel").innerHTML = summonerLevel;
			document.getElementById("sID").innerHTML = summonerID;
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
			
			},
			success:function (resp){
				matches =resp['matches'];
				document.getElementById("matchesAll").innerHTML = "";
				matches.forEach(function (match) {
						var stats = match.participants[0].stats;
						document.getElementById("matchesAll").innerHTML = "Match ID: "+match.matchId + 
						"<br> Queue Type: "+match.queueType+ 
						"<br>MapId: "+ match.mapId+ 
						"<br>ChampionId: " + match.participants[0].championId + 
						"<br>KDA: " + stats.kills +"/" +stats.deaths+"/"+stats.assists +
						"<br><hr>" + document.getElementById("matchesAll").innerHTML;
						
						/*stats: Object
						assists: 7
						champLevel: 18
						combatPlayerScore: 0
						deaths: 5
						doubleKills: 1
						firstBloodAssist: false
						firstBloodKill: false
						firstInhibitorAssist: true
						firstInhibitorKill: false
						firstTowerAssist: false
						firstTowerKill: false
						goldEarned: 13504
						goldSpent: 11905
						inhibitorKills: 0
						item0: 3001
						item1: 3020
						item2: 3165
						item3: 3089
						item4: 3191
						item5: 0
						item6: 3361
						killingSprees: 1
						kills: 6
						largestCriticalStrike: 0
						largestKillingSpree: 4
						largestMultiKill: 2
						magicDamageDealt: 152462
						magicDamageDealtToChampions: 17877
						magicDamageTaken: 13196
						minionsKilled: 213
						neutralMinionsKilled: 6
						neutralMinionsKilledEnemyJungle: 2
						neutralMinionsKilledTeamJungle: 4
						objectivePlayerScore: 0
						pentaKills: 0
						physicalDamageDealt: 25002
						physicalDamageDealtToChampions: 2258
						physicalDamageTaken: 6292
						quadraKills: 0
						sightWardsBoughtInGame: 0
						totalDamageDealt: 177764
						totalDamageDealtToChampions: 20160
						totalDamageTaken: 19901
						totalHeal: 3802
						totalPlayerScore: 0
						totalScoreRank: 0
						totalTimeCrowdControlDealt: 210
						totalUnitsHealed: 3
						towerKills: 2
						tripleKills: 0
						trueDamageDealt: 300
						trueDamageDealtToChampions: 25
						trueDamageTaken: 412
						unrealKills: 0
						visionWardsBoughtInGame: 2
						wardsKilled: 0
						wardsPlaced: 28
						winner: true*/
						});
				removeLoadSpinner();
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