let card = document.querySelector(".card");
let height = window.innerHeight;
card.style.minHeight = height +"px"

const burger = document.querySelectorAll('.navburger');
const cardNav = document.querySelector('.card-nav')
const tab = document.querySelectorAll('.tab')
burger.forEach(function(e){
	e.onclick = function(e){
		cardNav.style.display = "block";
	}
})

tab.forEach(function(e){
	e.onclick = function(e){
		cardNav.style.display = "none"
	}
})