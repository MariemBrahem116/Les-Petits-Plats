import { recettes } from '../script/recette.js';
let recettesArray = Object.entries(recettes);
let tagArray = { ingredient: [], appareil: [], ustensil: [] };
const ingBtnElt = document.getElementById("ing-btn");
const appBtnElt = document.getElementById("app-btn");
const ustBtnElt = document.getElementById("ust-btn");
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}
// const mainSection = document.getElementById("main");

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
const filterRecetteByIngredient = (recette ,tagArray,filterRecetteList) => {
    let found = true; // permet de verifier si la recette contient tous les ingredient selectionnés et enregistrer dans tagArray
    tagArray.ingredient.forEach(ingTag => { // on parcour laliste des tags deja ajouter
        
        let partial_found = false; // permet de verifier si une la recette a ilngredient ingTag
        
        recette[1].ingrédients.forEach(ing => { // on parcour les ingredient de la recttes
            const regex = new RegExp('^' + ingTag.toLowerCase() + '$'); // creation du regex avec ingTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
            if (regex.test(ing.ingrédient.toString().toLowerCase())) { 
                partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
            }
        });

        if (!partial_found) {
            found = false; // dans le cas ou aucune correspondance n'a été trouver.
        }
        if (found) { // si found = true alors la recettes contient tous les ingredients selectionnés.
            filterRecetteList.push(recette); // ajout dans notre liste filtrer.
        }
    });
}
/**
 * 
 * @param {*} recette 
 * @param {*} tagArray 
 * @param {*} filterRecetteList 
 */
const filterRecetteByAppareil = (recette ,tagArray,filterRecetteList) => {
    let found = true; // permet de verifier si la recette contient tous les ingredient selectionnés et enregistrer dans tagArray
console.log(recette[1])
    tagArray.appareil.forEach(ingTag => { // on parcour laliste des tags deja ajouter
        let partial_found = false; // permet de verifier si une la recette a ilngredient ingTag
            const regex = new RegExp('^' + ingTag.toLowerCase() + '$'); // creation du regex avec ingTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
           if(recette[1].appareil){
            if (regex.test(recette[1].appareil.toString().toLowerCase())) { 
                partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
            }
           }

        if (!partial_found) {
            found = false; // dans le cas ou aucune correspondance n'a été trouver.
        }
        if (found) { // si found = true alors la recettes contient tous les ingredients selectionnés.
            filterRecetteList.push(recette); // ajout dans notre liste filtrer.
        }
    });
}
/**
 * 
 * @param {*} liste 
 * @param {*} type 
 * @param {*} className 
 */
const filterRecetteByUstensil = (recette ,tagArray,filterRecetteList) => {
    let found = true; // permet de verifier si la recette contient tous les ingredient selectionnés et enregistrer dans tagArray
    console.log(recette[1].ustensiles)
    tagArray.ustensil.forEach(ingTag => { // on parcour laliste des tags deja ajouter
        
        let partial_found = false; // permet de verifier si une la recette a ilngredient ingTag
        const regex = new RegExp('^' + ingTag.toLowerCase() + '$'); // creation du regex avec ingTag en miniscule (^ = commence par le mot, $ = ce termine par le mot)
        if (regex.test(recette[1].ustensiles.toString().toLowerCase())) { 
            partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouver.
        }
       

        if (!partial_found) {
            found = false; // dans le cas ou aucune correspondance n'a été trouver.
        }
        if (found) { // si found = true alors la recettes contient tous les ingredients selectionnés.
            filterRecetteList.push(recette.flat()); // ajout dans notre liste filtrer.
        }
    });
}
//afficher la liste des appareils dans une liste
const appendFilterListe = (liste, type, className) => {
    let DropdownListe = document.querySelector(className);
    DropdownListe.innerHTML = "";

    liste.forEach((lst, i) => {
        if (i < 29) {
            let dropDownItem = create("li", { class: "dropDown-item" });

            dropDownItem.innerHTML = lst;

            dropDownItem.addEventListener("click", (e) => {
                let filterRecetteList = []; // liste filtrer

                switch (type) {
                    case "ingredient":
                        if(tagArray.ingredient.indexOf(lst)<0){
                            tagArray.ingredient.push(lst);
                        }
                        recettesArray.forEach(recette => { // on parcour la liste d'origine
                            filterRecetteByIngredient(recette,tagArray,filterRecetteList);
                        });
                        appendRecettes(filterRecetteList);
                        break;

                    case "appareil":
                        if(tagArray.appareil.indexOf(lst)<0){
                            tagArray.appareil.push(lst);
                        }
                        
                        recettesArray.forEach(recette => { // on parcour la liste d'origine
                            filterRecetteByAppareil(recette,tagArray,filterRecetteList);
                        });
                        appendRecettes(filterRecetteList);
                        break;
                    case "ustensil":
                        if(tagArray.ustensil.indexOf(lst)<0){
                            tagArray.ustensil.push(lst);
                        }
                        recettesArray.forEach(recette => { // on parcour la liste d'origine
                            filterRecetteByUstensil(recette,tagArray,filterRecetteList);
                        });
                        appendRecettes(filterRecetteList);

                    default:
                        break;
                }
                filterByTag(lst);
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

let unfilterTag = (tag) => {
    let recipeCards = Array.from(document.getElementsByClassName("cardsContainer"));
    let input = tag.toLowerCase();
    for (let i = 0; i < recipeCards.length; i++) {
        if (recipeCards[i].hasAttribute("style") && !recipeCards[i].innerHTML.toLowerCase().includes(input)) {
            recipeCards[i].removeAttribute("style");
        }
    }
}

/*document.addEventListener("click", (e) => {
    if (e.target.matches(".dropDown-item")) { 
    	
    }
    //supprimer le label
    else if (e.target.matches(".fa-times-circle")) { 
        document.getElementById("labels").removeChild(e.target.parentElement);
        unfilterTag(e.target.parentElement);
    }
    else if (e.target.matches(".fa-chevron-down")) { 
        e.target.parentElement.click();
    }
} );*/
let addItem = (array, parentElm) => {
	array.forEach(item => {
		let option = create("li", {class: "dropdown-item"});
		option.textContent = item.charAt(0).toUpperCase() + item.slice(1);
		parentElm.appendChild(option);
	})
}

let openDropdown = (btn, className, parentElm, inputId) => {
	closeAllDropdowns();
	let dropdownContainer = document.getElementById(parentElm);
	let inputField = document.getElementById(inputId);
	//run keyword search function
	inputField.parentElement.classList.add("show");
	inputField.parentNode.parentElement.classList.add("show");
	dropdownContainer.parentElement.classList.add("show-opts");
	btn.style.display = "none";
    document.getElementById(className).style.display = "block";
};

document.getElementById("ingredients").addEventListener("click", function(e) {openDropdown(e.target,"ingredientsOpen" ,"ingredients-dropdown", "ingredients-input")});

document.getElementById("appareils").addEventListener("click", function(e) {openDropdown(e.target,"appareilsOpen", "appareils-dropdown", "appareils-input")});

document.getElementById("ustensils").addEventListener("click", function(e) {openDropdown(e.target, "ustensilsOpen","ustensils-dropdown", "ustensils-input")});


let closeAllDropdowns = () => {
	Array.from(document.getElementsByClassName("drop")).forEach(btn => {btn.removeAttribute("style")});
	Array.from(document.getElementsByClassName("btn-search")).forEach(item => {item.classList.remove("show")});
	Array.from(document.getElementsByClassName("container-tag")).forEach(item => {item.classList.remove("show-opts")});
	Array.from(document.getElementsByClassName("open-btn")).forEach(item => {item.classList.remove("show")});
	Array.from(document.getElementsByClassName("fas fa-chevron-down")).forEach(item => {item.removeAttribute("style")});
}
Array.from(document.getElementsByClassName("fas fa-chevron-up")).forEach(item => {
	item.addEventListener("click", function() {
		closeAllDropdowns();
	});
});
