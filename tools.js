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
			window.alert("error getting Summoner data1! "+errorThrown);
		}
	});
}

function letsGetMasteries() {
	
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
			window.alert("error getting Summoner data1! "+errorThrown);
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
					},

					error: function (XMLHttpRequest, textStatus, errorThrown) {
						alert("error getting Summoner data2!");
					}
				});
			}
		}
		);
}


function getMatchHistory(){
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
			window.alert("error getting Summoner data1! "+errorThrown);
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
				alert("got it.");
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				alert("error getting match history");
			}
		});
	}});
}