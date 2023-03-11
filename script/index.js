import { recettes } from '../script/recette.js';
let recettesArray = Object.entries(recettes);
let tagArray = { ingredient: [], appareil: [], ustensil: [] };
let overLay = document.getElementById("overLay");
const searchInput = document.getElementById("searchInput");
const inputS = document.getElementById("input_search");
const labelsElt = document.getElementById("labels");

//foncion pour créer des éléments
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

//fonction pour créer les recettes
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

//fonction pour éliminer les doublons dans un tableau
const unique = (liste) => {
    var listeUnique = [];
    liste.forEach(elm => {
        if (listeUnique.indexOf(elm) < 0) {
            listeUnique.push(elm);
        }
    })
    return listeUnique;
}

//fonction qui permet de filter les cards selon les tags
/**
 * 
 * @param {*} recettes 
 */
const filterRecetteByTags = (recettes) => {
    let found = true; // permet de verifier si la recette contient tous les ingredients selectionnés et enregistrés dans tagArray
    tagArray.ingredient.forEach(ingTag => {
        let newList = [];
        recettes.forEach(recette => {
            let partial_found = false; // permet de verifier si une de  recette a ingredient ingTag
            recette[1].ingrédients.forEach(ing => {
                if (ing.ingrédient.toString().toLowerCase() === ingTag.toLowerCase()) {
                    partial_found = true; // partial_found passe a true pour dire qu'une correspondance a été trouvée.
                }
            });
            if (partial_found) {
                newList.push(recette); // dans le cas ou aucune correspondance n'a été trouvée.
            }
        });
        recettes = newList;
    });

    tagArray.appareil.forEach(appTag => { 
        let newList = [];
        recettes.forEach(recette => {
            let partial_found = false; 
            if (recette[1].appareil) {
                if (recette[1].appareil.toLowerCase() === appTag.toLowerCase()) {
                    partial_found = true; 
                }
            }
            if (partial_found) {
                newList.push(recette); 
            }
        });
        recettes = newList;
    });

    tagArray.ustensil.forEach(ustTag => { 
        let newList = [];
        recettes.forEach(recette => {
            let partial_found = false; 
            recette[1].ustensiles.forEach(ust => { 
                if (ust.toString().toLowerCase() === ustTag.toLowerCase()) {
                    partial_found = true; 
                }
            });
            if (partial_found) {
                newList.push(recette); 
            }
        });
        recettes = newList;
    });
    return recettes;
}

//fonction qui affiche la liste des ingrédients ,appareils et ustensils dans une liste
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
                        if (tagArray.ingredient.indexOf(lst) < 0) {
                            tagArray.ingredient.push(lst);
                        }

                        break;

                    case "appareil":
                        if (tagArray.appareil.indexOf(lst) < 0) {
                            tagArray.appareil.push(lst);
                        }

                        break;
                    case "ustensil":
                        if (tagArray.ustensil.indexOf(lst) < 0) {
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

// fonction qui récupére tout les ingrédients
const getAllIngredient = (recettes) => {
    let listeIngredient = [];
    recettes.forEach(recette => {
        listeIngredient.push(...recette[1].ingrédients.map(ing => ing.ingrédient));
    })
    appendFilterListe(unique(listeIngredient), "ingredient", ".ingredients-dropdown");

}

//fonction quirécupére tous les appareils
const getAllAppliances = (recettes) => {
    let listeAppliances = [];
    recettes.forEach(recette => {
        if (!recette[1].appliance) {
            listeAppliances.push(recette[1].appareil);
        }
    })
    appendFilterListe(unique(listeAppliances), "appareil", ".appareils-dropdown");

}

//fonction qui récupére tous les ustensils
const getAllUstensils = (recettes) => {
    let listeUstensil = [];
    recettes.forEach(recette => {
        listeUstensil.push((recette[1].ustensiles));
    })
    appendFilterListe(unique(listeUstensil.flat()), "ustensil", ".ustensils-dropdown");

}

function appendRecettes(recettes) {
    getAllIngredient(recettes);
    getAllAppliances(recettes);
    getAllUstensils(recettes)
    document.getElementById("cardsRecipe").innerHTML = "";
    recettes.forEach(recette => createRecette(recette));
}

appendRecettes(recettesArray);

// fonction qui permet de créer un bouton label dans ingrédients, appareils et ustensils
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

//fonction qui permet de normalizer un text
const normalize = (text) => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

//filtrer la liste des tags en remplissant l'input
let tagSearch = (input, options) => {
    input.addEventListener("input", function (e) {
        for (let i = 0; i < options.length; i++) {
            if (!normalize(options[i].textContent).includes(normalize(e.target.value))) {
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
    overLay.style.display = "block";
};

document.getElementById("ingredients").addEventListener("click", function () { openDropdown("ingredients", "container-tagIng") });
document.getElementById("appareils").addEventListener("click", function () { openDropdown("appareils", "container-tagApp") });
document.getElementById("ustensils").addEventListener("click", function () { openDropdown("ustensils", "container-tagUst") });

let closeAllDropdowns = () => {
    overLay.style.display = "none";
    Array.from(document.getElementsByClassName("drop")).forEach(btn => { btn.removeAttribute("style") });
    Array.from(document.getElementsByClassName("open-btn")).forEach(item => { item.classList.remove("show-opts") });
    Array.from(document.getElementsByClassName("fas fa-chevron-down")).forEach(item => { item.removeAttribute("style") });
}
overLay.addEventListener("click", () => {
    closeAllDropdowns();
})
Array.from(document.getElementsByClassName("fas fa-chevron-up")).forEach(item => {
    item.addEventListener("click", function () {
        closeAllDropdowns();
    });
});
let closeLists = (element) => {
    let x = document.getElementsByClassName("listeSearch");
    for (let i=0; i<x.length; i++) {
        if (element != x[i] && element != searchInput) {
            x[i].parentNode.removeChild(x[i]);
        }
    }
}

searchInput.addEventListener("input",()=>{
    if(searchInput.value.length > 2){
    let val = normalize(searchInput.value);
    var regex = new RegExp(val);
    closeLists();
    let a = create("div", {class: "listeSearch"});
				//append to parent element
				inputS.appendChild(a);
				for (let i=0; i<recettes.length; i++) {
					if (regex.test(recettes[i].nom) === val) {
						let b = create("p");
						b.textContent = recettes[i].nom;
                        console.log(b);
						//when click on the value
						b.addEventListener("click", function() {
							//insert value
							inputS.value = this.textContent;
							//close list
							closeLists();
						});
						a.appendChild(b);
					}
				}
    }
    else {
        closeLists();
    }
    document.addEventListener("click", function(e) {
        closeLists(e.target);
    })
})
//méthode de recherche en utilisant les objets array
let launchSearch = (e) => {
    let cardsRecipe = document.getElementById("cardsRecipe");
    if (searchInput.value.length > 2) {
        cardsRecipe.innerHTML = "";
        let input = normalize(e.target.value);
        var searchListe = [];
        const listeRecette = [...recettesArray];
        listeRecette.forEach((recette,i) =>{
            const ingrédients = recette[1].ingrédients.map(ing => normalize(ing.ingrédient) );
            const nom = normalize(recette[1].nom);
            const description = normalize(recette[1].description);
            const allFilters = [nom,ingrédients,description];
            if (nom.includes(input) || description.includes(input)  || ingrédients.includes(input)) {
                searchListe.push(allFilters);
                listeRecette.splice(i, 1);
            
            }
        })
     
        if (searchListe.length === 0) {
            cardsRecipe.innerHTML = "<p id='msgResult'>« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>";
        }
        else {
            appendRecettes(filterRecetteByTags(searchListe));
            createLabel();
        }
    }
    else {
        appendRecettes(filterRecetteByTags(recettesArray));
        createLabel();
    }
}
searchInput.addEventListener("keyup", function (e) { launchSearch(e) });