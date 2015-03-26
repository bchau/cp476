var ID = "";
var APIKEY = "a202172b-de9e-497e-b13d-a0600e839d90";

function summonerLookUp() {
    //ID = $("#userName").val();
	ID = document.getElementById("userName").value;
    //APIKEY = $("#theKey").val();
	window.alert("Hello "+ID);

    if (ID != "") {

        $.ajax({
            url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + ID + '?api_key=' + APIKEY,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                var userID = ID.replace(" ", "");

                userID = userID.toLowerCase().trim();

                summonerLevel = json[userID].summonerLevel;
                summonerID = json[userID].id;

                document.getElementById("sLevel").innerHTML = summonerLevel;
                document.getElementById("sID").innerHTML = summonerID;

                letsGetMasteries(summonerID);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.alert("error getting Summoner data1!");
            }
        });
    } else {
		window.alert("Enter a summoner name");
	}
}

function letsGetMasteries(summonerID) {
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