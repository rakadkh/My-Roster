const fetch = function () {
    let input = $("#team-input").val().toLowerCase()
    $.get(`/teams/${input}`, function (players) {
        $("#players").empty()
        if (players !== 'error') {
            const source = $('#player-template').html()
            const template = Handlebars.compile(source)
            let newHTML = template({ players: players })
            $("#players").append(newHTML)
        }
        else {
            $("#players").append(`<p>Enter valid Input!</p>`)
        }
        $("#team-input").val("")
    })
}


const SetDefaultImage=function(x){
    $(x).attr("src","https://img.favpng.com/2/15/3/basketball-slam-dunk-png-favpng-HstDfbVaK75iu8c9Uq6ceGm5u.jpg")
}



const CLick=function(x){
    if($(x).attr("id")==="true"){
        let name=$(x).siblings(".name").attr('id')
        console.log(`first: ${name}`);
        $.get(`/playerStats/${name}`, function (stats) {
            if (stats !== null) {
                $(x).empty()
                try {
                    stats=JSON.parse(stats)    
                }
                catch{
                    $(x).append(`<p>${stats}</p>`)
                    $(x).css("color", "red")
                    return;
                }            
                cnt=0
                for(i in stats){
                    if(cnt>2){$(x).append(`<p>${i}: ${stats[i]}</p>`)}
                    cnt++  
                }
                $(x).attr("id","false");
            }
        })
    }
    else{
        console.log("Sssssss");
        let name=$(x).siblings('.name').attr("id")
        s = name.split(/(?<=^\S+)\s/)
        $(x).empty()
        $(x).append(`<img class="image" src="https://nba-players.herokuapp.com/players/${s[1]}/${s[0]}" onerror="SetDefaultImage(this)" onclick="CLick(this)">`)
        $(x).attr("id","true");
    }
}