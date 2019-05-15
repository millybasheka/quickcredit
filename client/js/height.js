let card = document.querySelector(".card");
const logout = document.querySelector(".Logout")
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

logout.onclick = () => {
	window.location.href="https://elemanhillary.github.io/QuickCredit/auth_pages/"
	localStorage.removeItem('token')
}