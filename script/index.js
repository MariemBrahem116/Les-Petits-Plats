import { recettes } from '../script/recette.js';
let recettesArray = Object.entries(recettes);
let tagArray = { ingredient: [], appareil: [], ustensil: [] };
let overLay = document.getElementById("overLay");
const searchInput = document.getElementById("searchInput");
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

let createRecette = (recette) => {
    let image = create("div", { class: "imageCard", alt: "imageCard" });
    let titlecards = create("div", { class: "cards-title-header" });
    let cardsBody = create("div", { class: "cards-title-body" });
    let ingredient = create("p", { class: "cardsIngredient" });

    let allIngredient = recette[1].ingrédients.map(elm => {
        if (Object.prototype.hasOwnProperty.call(elm, "quantité") && Object.prototype.hasOwnProperty.call(elm, "unit")) {
            return "<p class='ingredients'><span class='ingredientBold'>" + elm.ingrédient + "</span>: " + elm.quantité + elm.unit + "</p>";
        } else if (Object.prototype.hasOwnProperty.call(elm, "quantité") && !Object.prototype.hasOwnProperty.call(elm, "unit")) {
            return "<p class='ingredients'><span class='ingredientBold'>" + elm.ingrédient + "</span>: " + elm.quantité + "</p>";
        } else if (!Object.prototype.hasOwnProperty.call(elm, "quantité") && !Object.prototype.hasOwnProperty.call(elm, "unit")) {
            return "<p class='ingredients'><span class='ingredientBold'>" + elm.ingrédient + "</span></p>";
        }
    }).join("");

    image.setAttribute("id", recette[1].id);
    ingredient.innerHTML = allIngredient;
    let method = create("p", { class: "methodRecette" });
    method.innerHTML = recette[1].description;
    let timeCrads = create("div", { class: "time-cards" });
    timeCrads.innerHTML = "<span class='far fa-clock '> </span>" + "<p class='timecards'> " + recette[1].temps + " min</p>"
    let title = create("h2", { class: "cardsTitle" });
    title.textContent = recette[1].nom;
    let cardContainer = create("article", { class: "cardsContainer" });
    cardsBody.append(ingredient, method);
    titlecards.append(title, timeCrads);
    cardContainer.append(image, titlecards, cardsBody);
    // let mainSection = document.getElementById("main");
    let section = document.getElementById("cardsRecipe");
    section.appendChild(cardContainer);
    // mainSection.appendChild(section);
}

//éliminer les doublons dans un tableau
const unique = (liste) => {
    var listeUnique = [];
    liste.forEach(elm => {
        if (listeUnique.indexOf(elm) < 0) {
            listeUnique.push(elm);
        }
    })
    return listeUnique;
}


/**
 * 
 * @param {*} recettes 
 */
const filterRecetteByTags = (recettes) => {
    let found = true; // permet de verifier si la recette contient tous les ingredient selectionnés et enregistrer dans tagArray
    
    tagArray.ingredient.forEach(ingTag => {
        let newList = [];
        recettes.forEach(recette => {
            let partial_found = false; // permet de verifier si une la recette a ilngredient ingTag
            recette[1].ingrédients.forEach(ing => {
                // const regex = new RegExp('^' + ingTag.toLowerCase() + '$'); // creation du regex avec ingTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
                if (ing.ingrédient.toString().toLowerCase() === ingTag.toLowerCase()) {
                    partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
                }
            });
            if (partial_found) {
                newList.push(recette); // dans le cas ou aucune correspondance n'a été trouver.
            }
        });
        recettes = newList;
    });
    
    tagArray.appareil.forEach(appTag => { // on parcour laliste des tags deja ajouter
        let newList = [];
       
        recettes.forEach(recette => {
            let partial_found = false; // permet de verifier si une la recette a ilngredient appTag
            // const regex = new RegExp('^' + appTag.toLowerCase() + '$'); // creation du regex avec appTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
            if(recette[1].appareil){
                if (recette[1].appareil.toLowerCase() === appTag.toLowerCase()) { 
                    partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
                }
            }
            if (partial_found) {
                newList.push(recette); // dans le cas ou aucune correspondance n'a été trouver.
            }
        });
        recettes = newList;
    });
    
    tagArray.ustensil.forEach(ustTag => { // on parcour laliste des tags deja ajouter
        let newList = [];
       
        recettes.forEach(recette => {
            let partial_found = false; // permet de verifier si une la recette a ustensile ustTag
        
            recette[1].ustensiles.forEach(ust => { // on parcour les ustensiles de la recttes
                // const regex = new RegExp('^' + ustTag.toLowerCase() + '$'); // creation du regex avec ustTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
                if (ust.toString().toLowerCase() === ustTag.toLowerCase()) { 
                    partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
                }
            });
            if (partial_found) {
                newList.push(recette); // dans le cas ou aucune correspondance n'a été trouver.
            }
        });
        recettes = newList;
    });
    // console.log(recettes);
    return recettes;
}

//afficher la liste des appareils dans une liste
const appendFilterListe = (liste, type, className) => {
    let DropdownListe = document.querySelector(className);
    DropdownListe.innerHTML = "";

    liste.forEach((lst, i) => {
        if (i < 30) {
            let dropDownItem = create("li", { class: "dropDown-item" });

            dropDownItem.innerHTML = lst;

            dropDownItem.addEventListener("click", (e) => {
                closeAllDropdowns();
                let filterRecetteList = []; // liste filtrer
                switch (type) {
                    case "ingredient":
                        if(tagArray.ingredient.indexOf(lst)<0){
                            tagArray.ingredient.push(lst);
                        }
                        
                        break;

                    case "appareil":
                        if(tagArray.appareil.indexOf(lst)<0){
                            tagArray.appareil.push(lst);
                        }
                        
                        break;
                    case "ustensil":
                        if(tagArray.ustensil.indexOf(lst)<0){
                            tagArray.ustensil.push(lst);
                        }
                    default:
                        break;
                }
                filterRecetteList = filterRecetteByTags(recettesArray);
                appendRecettes(filterRecetteList);
                createLabel();
            })
            DropdownListe.appendChild(dropDownItem); 
        }
    })
}

// récupérer tout les ingrédients
const getAllIngredient = (recettes) => {
    let listeIngredient = [];
    recettes.forEach(recette => {
        listeIngredient.push(...recette[1].ingrédients.map(ing => ing.ingrédient));
    })
    appendFilterListe(unique(listeIngredient),"ingredient",".ingredients-dropdown");
    
}


//récupérer tous les appareils
const getAllAppliances = (recettes) => {
    let listeAppliances = [];
    recettes.forEach(recette => {
        if (!recette[1].appliance) {
            listeAppliances.push(recette[1].appareil);
        }
    })
    appendFilterListe(unique(listeAppliances),"appareil",".appareils-dropdown");
    
}

//récupérer tous les ustensils
const getAllUstensils = (recettes) => {
    let listeUstensil = [];
    recettes.forEach(recette => {
        listeUstensil.push((recette[1].ustensiles));
    })
    appendFilterListe(unique(listeUstensil.flat()),"ustensil",".ustensils-dropdown");
   
}

function appendRecettes(recettes) {
    getAllIngredient(recettes);
    getAllAppliances(recettes);
    getAllUstensils(recettes)
    document.getElementById("cardsRecipe").innerHTML = "";
    recettes.forEach(recette => createRecette(recette));
}

appendRecettes(recettesArray);

// créer un bouton label
const labelsElt = document.getElementById("labels");


const createLabel = () => {
    labelsElt.innerHTML = '';
    tagArray.ingredient.forEach((ingTag, i) => {
        const elt = create("button", { class: "selected-label ingredientsOpen" });
        const span = create("span", { class: "fas fa-times-circle" })
        span.addEventListener('click', () => {
            tagArray.ingredient.splice(i, 1);
            appendRecettes(filterRecetteByTags(recettesArray));
            createLabel();
        });
        elt.append(ingTag, span);
        labelsElt.appendChild(elt);
    });
    tagArray.appareil.forEach((ingTag, i) => {
        const elt = create("button", { class: "selected-label appareilsOpen" });
        const span = create("span", { class: "fas fa-times-circle" })
        span.addEventListener('click', (e) => {
            tagArray.appareil.splice(i, 1);
            appendRecettes(filterRecetteByTags(recettesArray));
            createLabel();
        });
        elt.append(ingTag, span);
        labelsElt.appendChild(elt);
    });
    tagArray.ustensil.forEach((ingTag, i) => {
        const elt = create("button", { class: "selected-label ustensilsOpen" });
        const span = create("span", { class: "fas fa-times-circle" });
        span.addEventListener('click', () => {
            tagArray.ustensil.splice(i, 1);
            appendRecettes(filterRecetteByTags(recettesArray));
            createLabel();
        });
        elt.append(ingTag, span);
        labelsElt.appendChild(elt);
    });
 
};

/**
 * filter les cards selon les tags
 * @param {*} tag 
 */
let filterByTag = (tag) => {
    let recetteCards = Array.from(document.getElementsByClassName("cardsContainer"));
    let input = tag.toLowerCase();
    for (let i = 0; i < recetteCards.length; i++) {
        if (!recetteCards[i].hasAttribute("style")) {
            if (!recetteCards[i].innerHTML.toLowerCase().includes(input)) {
                recetteCards[i].style.display = "none";
            } else {
                recetteCards[i].removeAttribute("style");
            }
        }
    }
}

//filtrer la liste des tags en remplissant l'input
let tagSearch = (input, options) => {
    input.addEventListener("input", function (e) {
        for (let i = 0; i < options.length; i++) {
            if (!options[i].textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
                options[i].style.display = "none";
            } else {
                options[i].removeAttribute("style");
            }
        }
    })
}

const ingredientsInput = document.getElementById("ingredients-input");
const appareilInput = document.getElementById("appareils-input");
const ustensilInput = document.getElementById("ustensils-input");
tagSearch(ingredientsInput, Array.from(document.querySelectorAll("#ingredients-dropdown .dropDown-item")));
tagSearch(appareilInput, Array.from(document.querySelectorAll("#appareils-dropdown .dropDown-item")));
tagSearch(ustensilInput, Array.from(document.querySelectorAll("#ustensils-dropdown .dropDown-item")));

let openDropdown = (btn, parentElm) => {
	closeAllDropdowns();
	let dropdownContainer = document.getElementById(parentElm);
	dropdownContainer.parentNode.classList.add("show-opts");
    let btnElement = document.getElementById(btn);
	btnElement.style.display = "none";
   overLay.style.display ="block";
};
document.getElementById("ingredients").addEventListener("click", function() {openDropdown("ingredients","container-tagIng")});

document.getElementById("appareils").addEventListener("click", function() {openDropdown("appareils", "container-tagApp")});

document.getElementById("ustensils").addEventListener("click", function() {openDropdown("ustensils","container-tagUst")});

let closeAllDropdowns = () => {
    overLay.style.display = "none";
	Array.from(document.getElementsByClassName("drop")).forEach(btn => {btn.removeAttribute("style")});
	Array.from(document.getElementsByClassName("open-btn")).forEach(item => {item.classList.remove("show-opts")});
	Array.from(document.getElementsByClassName("fas fa-chevron-down")).forEach(item => {item.removeAttribute("style")});
}
overLay.addEventListener("click",()=>{
    closeAllDropdowns();
})
Array.from(document.getElementsByClassName("fas fa-chevron-up")).forEach(item => {
	item.addEventListener("click", function() {
		closeAllDropdowns();
	});
});

let createFilteredArr = (arr) => {
	let filteredArr = [];
	for (let i = 0; i<arr.length; i++) {
		let filtered = (({id, ingrédients, nom, description}) => ({id, ingrédients, nom, description}))(arr[i][1]);
		filteredArr.push(filtered);
	}
	return filteredArr;
}

let filteredArr = createFilteredArr(recettesArray);
console.log(filteredArr);
function FilterKeyword(item) {
    this.id = item.id;
	let Ingredient = item.ingrédients.map(b => b.ingrédient.toLowerCase()).flat();
	let keywordString = item.nom + " " + Ingredient + " " + item.description;
	let uniqueValue = [...new Set(keywordString.split(/[\s,().]+/))];
    this.keyWord = uniqueValue;
}

let extractKeyword = (arr) => {
	let newArr = [];
	for (let i=0; i<arr.length; i++) {
		let keyword = new FilterKeyword(arr[i]);
		newArr.push(keyword);
	}
	return newArr;
}
console.log("kkkkkk");
let filteredKeywordArr = extractKeyword(filteredArr);
console.log(filteredKeywordArr)
let launchSearch = (e) => {
	let cardsRecipe = document.getElementById("cardsRecipe");
	if (searchInput.value.length > 2) {
		cardsRecipe.innerHTML = "";
		let input = e.target.value.toLowerCase();
        var searchListe = [];
        const regex = new RegExp(input);
        const listeRecette = [...recettesArray];
		for( var i = 0 ; i < listeRecette.length ; i++){
            let recette = listeRecette[i];
            
            for(var k = 0 ; k < recette[1].ingrédients.length ; k++){
                
                if(regex.test(recette[1].ingrédients[k].ingrédient.toLowerCase())){
                    console.log(recette[1].ingrédients[k].ingrédient,regex);
                    searchListe.push(recette);

                    listeRecette.splice(i,1);
                }
                
            }  
        }
		if(searchListe.length === 0){
             
            cardsRecipe.innerHTML = "<p id='msgResult'>« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>";    
        }
        else{
            appendRecettes(filterRecetteByTags(searchListe));
            createLabel();
        }
	} 
    else{
        appendRecettes(filterRecetteByTags(recettesArray));
            createLabel();
    }
}
searchInput.addEventListener("keyup", function(e) {launchSearch(e)});