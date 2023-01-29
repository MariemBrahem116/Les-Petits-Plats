import {recettes} from '../script/recette.js';
let recettesArray = Object.entries(recettes);
console.log(recettesArray);
const create = (elm, attributes) => {
	const element = document.createElement(elm);
	for (let key in attributes) {
		element.setAttribute(key, attributes[key])
	}
	return element;
}
let createRecette = (recette) =>{
    let image = create("div", {class: "imageCard", alt: "imageCard"});
    let titlecards = create("div",{class:"cards-title-header"});
    let timeCrads = create("div",{class:"time-cards"});
    timeCrads.innerHTML = "<span class='far fa-clock ' style='font-size:1.5rem'> </span>" + " <p class='timecards'>" + recette[1].temps + " min</p>"
    let title = create("h2", {class: "cardsTitle"});
	title.textContent = recette[1].nom;
    let cardContainer = create("article", {class: "cardsContainer"});
    titlecards.append(title,timeCrads);
    cardContainer.append(image,titlecards);
    let mainSection = document.getElementById("main");
    let section = document.getElementById("cardsRecipe");
    section.appendChild(cardContainer);
    mainSection.appendChild(section);
} 
recettesArray.forEach(recette => createRecette(recette));