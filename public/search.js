to_add = ''
freeSearch = false;
saerchResult = ``
previousSearches = 0;

searchName = ``
searchWeight = 0

class Criteria {
    constructor(type, weight, name) {
        this.type = type;
        this.weight = weight;
        this.name = name;
    }
}

prevSearches = []

function processPokeResp(data){
    backgroundColor = "";
    switch(data.types[0].type.name) {
        case "normal":  
            backgroundColor = "#A8A77A"
            break;
        case "fire":    
            backgroundColor = "#EE8130"
            break;
        case "water":   
            backgroundColor = "#6390F0"
            break;
        case "electric":
            backgroundColor = "#F7D02C"
            break;
        case "grass":   
            backgroundColor = "#7AC74C"
            break;
        case "ice":     
            backgroundColor = "#96D9D6"
            break;
        case "fighting":
            backgroundColor = "#C22E28"
            break;
        case "poison":  
            backgroundColor = "#A33EA1"
            break;
        case "ground":  
            backgroundColor = "#E2BF65"
            break;
        case "flying":  
            backgroundColor = "#A98FF3"
            break;
        case "psychic": 
            backgroundColor = "#F95587"
            break;
        case "bug":     
            backgroundColor = "#A6B91A"
            break;
        case "rock":    
            backgroundColor = "#B6A136"
            break;
        case "ghost":   
            backgroundColor = "#735797"
            break;
        case "dragon":  
            backgroundColor = "#6F35FC"
            break;
        case "dark":    
            backgroundColor = "#705746"
            break;
        case "steel":   
            backgroundColor = "#B7B7CE"
            break;
        case "fairy":   
            backgroundColor = "#D685AD"
            break;
        default: backgroundColor = "none"
    }
}

async function loadSearchResults(data) {
    i = 0;
    while (data.pokemon[i] != undefined) {
        await $.ajax({
            type: "GET",
            url: data.pokemon[i].pokemon.url,
            success: processPokeResp
        })
        i++
    }

    jQuery("main").html(to_add)
}

async function search() {
    jQuery("main").html("Loading...")
    to_add = ``
    searchName = document.getElementById("searchBar").value

    if (document.getElementById("searchBar").value.length == 0) {
        freeSearch = true
    } else {freeSearch = false}

    if ($('#typeFilter :selected').val() == `any`) {
    	for ( i=1; i<899; i++)
    	{
            type = `localhost:8888/api/v1/pokemon?${i}`
            await $.ajax({
                type: "GET",
                url: type,
                success: processPokeResp
            })
    	}
        jQuery("main").html(to_add)
        saveResult()
        return
    }

    type = `https://pokeapi.co/api/v2/type/${$('#typeFilter :selected').val()}/`
    console.log(type)
    await $.ajax({
        type: "GET",
        url: type,
        success: loadSearchResults
    })

saveResult()
}

function saveResult() {
    result = new Criteria($('#typeFilter :selected').val(),
                          document.getElementById("searchBar").value)
    prevSearches.push(result)

    saerchResult += 
    `
    <option value="${previousSearches}" id="${previousSearches}">
        <ol>
            <li>Type: <span id="${previousSearches}type">${$('#typeFilter :selected').val()}</span>,</li>
            <li>Name: <span id="${previousSearches}name">${document.getElementById("searchBar").value}</span></li>
        </ol>
    </option>
    `
    jQuery("#prevSearch").html(saerchResult)
    previousSearches++
}

async function previousSearch() {
    jQuery("main").html("Loading...")
    to_add = ``

    searchName = prevSearches[$('#prevSearch :selected').val()].name
    searchWeight = prevSearches[$('#prevSearch :selected').val()].weight
    type = `https://pokeapi.co/api/v2/type/${prevSearches[$('#prevSearch :selected').val()].type}/`
    await $.ajax({
        type: "GET",
        url: type,
        success: loadSearchResults
    })
}
    // for (let index = 0; index < previousSearches; index++) {
    //     if (document.getElementById(index).value == $('#prevSearch :selected').val()) {
    //         console.log(index)
    //         console.log(document.getElementById(`${index}name`))
    //         (document.getElementById(`${index}name`))
    //         // searchName = document.getElementById(`${index}name`).value
    //         // searchWeight = document.getElementById(`${index}name`).value

    //         type = `https://pokeapi.co/api/v2/type/${document.querySelectorAll(`${index}type`)}/`
    //         await $.ajax({
    //             type: "GET",
    //             url: type,
    //             success: loadSearchResults
    //         })
    //     }
    // }

