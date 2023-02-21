import { recettes } from '../script/recette.js';
let recettesArray = Object.entries(recettes);
let tagArray = {ingredient:[],appareil:[],ustensil:[]};
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
    let mainSection = document.getElementById("main");
    let section = document.getElementById("cardsRecipe");
    section.appendChild(cardContainer);
    mainSection.appendChild(section);
}

recettesArray.forEach(recette => createRecette(recette));

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

//afficher les 30 premiers ingrédients dans une liste
const appendIngredientFilterListe = (liste ,type="ingredient") => {
    let ingredientsDropdown = document.querySelector(".ingredients-dropdown");
    liste.forEach((lst, i) => {

        if (i < 29) {
            let ingredientDrop = create("li", { class: "dropDown-item" });
            ingredientDrop.innerHTML = lst;
            ingredientDrop.addEventListener("click", (e) => {
                createLabel(lst,type);
               
                switch (type) {
                    case "ingredient":
                        tagArray.ingredient.push(lst);
                        let input = lst.toLowerCase();
                        let filterRecetteList = [];
                        recettesArray.forEach(recette => {

                            recette[1].ingrédients.forEach( ing => {
                                console.log(ing.ingrédient,lst);
                                if(ing.ingrédient.toString().toLowerCase() === lst.toLowerCase()){
                                    filterRecetteList.push(recette); 
                                }
                            })
                        });
                        console.log(filterRecetteList);
                        //getAllIngredient(filterRecetteList);
                        appendIngredientFilterListe(getAllIngredient(filterRecetteList));
                        break;
                
                    default:
                        break;
                }
              //  filterByTag(lst);
            })
            ingredientsDropdown.appendChild(ingredientDrop);
        }
    })
}

// récupérer tout les ingrédients
const getAllIngredient = (recettes) => {
    let listeIngredient = [];
    recettes.forEach(recette => {
        listeIngredient.push(...recette[1].ingrédients.map(ing => ing.ingrédient));
    })
    appendIngredientFilterListe(unique(listeIngredient));
}

getAllIngredient(recettesArray);

//afficher la liste des appareils dans une liste
const appendApplianceFilterListe = (liste) => {
    let appliancesDropdown = document.querySelector(".appareils-dropdown");
    liste.forEach((lst) => {
        let applianceDrop = create("li", { class: "dropDown-item" });
        applianceDrop.innerHTML = lst;
        appliancesDropdown.appendChild(applianceDrop);

    })
}

//récupérer tous les appareils
const getAllAppliances = (recettes) => {
    let listeAppliances = [];
    recettes.forEach(recette => {
        if (!recette[1].appliance) {
            listeAppliances.push(recette[1].appareil);
        }
    })
    appendApplianceFilterListe(unique(listeAppliances));
}

getAllAppliances(recettesArray);

//afficher la liste des ustensils dans une liste
const appendUstensilFilterListe = (liste) => {
    let ustensilsDropdown = document.querySelector(".ustensils-dropdown");
    liste.forEach((lst) => {
        let ustensilDrop = create("li", { class: "dropDown-item" });
        ustensilDrop.innerHTML = lst;
        ustensilsDropdown.appendChild(ustensilDrop);
    })
}

//récupérer tous les ustensils
const getAllUstensils = (recettes) => {
    let listeUstensil = [];
    recettes.forEach(recette => {
        listeUstensil.push((recette[1].ustensiles));
    })
    appendUstensilFilterListe(unique(listeUstensil.flat()));
}

getAllUstensils(recettesArray);

// créer un bouton label
const labelsElt = document.getElementById("labels");
const createLabel = (data,type) => {
    const elt = create("button", { class: "selected-label " });
    switch (type) {
        case "ingredient":
            elt.classList.add("ingredientsOpen"); 
            
            break;
    
        default:
            break;
    }
    elt.innerHTML = data + "<span class='fas fa-times-circle'></span>";
    labelsElt.appendChild(elt);
};

//filter les cards selon les tags
let filterByTag = (tag) => {
    let recetteCards = Array.from(document.getElementsByClassName("cardsContainer"));
    let input = tag.textContent.toLowerCase();
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
    let input = tag.textContent.toLowerCase();
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


const buttonUp = document.querySelector(".fa-chevron-up")
const ingredientsElement = document.getElementById("ingredients");
const appareilElement = document.getElementById("appareils");
const ustensilsElement = document.getElementById("ustensils");
const appareilsOpen = document.getElementById("appareilsOpen");
const ustensilsOpen = document.getElementById("ustensilsOpen");
const buttonDown = document.querySelector(".fa-chevron-down");
const ingredientsOpen = document.getElementById("ingredientsOpen");
buttonDown.addEventListener("click", () => {
    ingredientsElement.style.display = "none";
    appareilElement.style.display = "none";
    ustensilsElement.style.display = "none";
    ingredientsOpen.style.display = "block";
    appareilsOpen.style.display = "block";
    ustensilsOpen.style.display = "block";
})
buttonUp.addEventListener("click", () => {
    ingredientsElement.style.display = "block";
    ingredientsOpen.style.display = "none"

})