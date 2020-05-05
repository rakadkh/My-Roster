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


const SetDef=function(x){
    $(x).attr("src","https://img.favpng.com/2/15/3/basketball-slam-dunk-png-favpng-HstDfbVaK75iu8c9Uq6ceGm5u.jpg")
}


let firstClick = true;

const CLick=function(x){
    if(firstClick){
    let name=$(x).siblings(".name").attr('id').toLowerCase()
    s = name.split(/(?<=^\S+)\s/)
    console.log(name);
    $.get(`/playerStats/${name}`, function (stats) {
        if (stats !== 'error') {
            $(x).empty()
            cnt=0
            for(i in stats){
                if(cnt>2){
                    $(x).append(`<p>${i}: ${stats[i]}</p>`)}
                cnt++  
            }
        }
    })
    firstClick = false;
}
    else{
        console.log("Sssssss");
        let name=$(x).siblings('.name').attr("id")
        s = name.split(/(?<=^\S+)\s/)
        $(x).empty()
        $(x).append(`<img class="image" src="https://nba-players.herokuapp.com/players/${s[1]}/${s[0]}" onerror="SetDef(this)" onclick="CLick(this)">`)
        firstClick=true;
    }
}