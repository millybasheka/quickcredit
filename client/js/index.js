const errors = document.querySelector('.errors');
const errorText = document.querySelector('.errors-body p');
const success = document.querySelector('.success');

(function () {
	let type = Array.from(document.querySelectorAll(".card-loan-type"));
	let loanForm = document.querySelector(".loan_form");
	let loantype = document.getElementById("loanType");
	let tenor = document.getElementById("tenor");
	let applyBtn = document.getElementById("apply");
	let card = document.querySelector(".card");
	let top, left, width, height = 0;
	tenor.onblur = (e) => {
		if (tenor.value > 12) {
			apply.disabled = true;
			apply.style.backgroundColor = "#9ea1a2d6";
			apply.style.border = "none";
			apply.setAttribute("value", "tenor must be less than or equal 12")
		} else {
			apply.disabled = false;
			apply.style.border = "2px solid #0084d7";
			apply.style.backgroundColor = "#0084d7";
			apply.setAttribute("value", "Apply")
		}
	}
	loanForm.onmouseenter = (e) => {
		loanForm.style.top= `${top}px`;
		loanForm.style.left= `${left}px`;
		// loanForm.style.transition = "bottom 800ms .2s";
		// loanForm.style.transitionTimingFunction = "cubic-bezier(0.4,0, 1,1)";
	}
	for (let i = 0; i < type.length; i++) {
		width = type[i].clientWidth;
		height = type[i].clientHeight;
		type[i].style.backgroundPosition = `${width - height}px, 0px`;
	}
	let img, bi, style;
	for (let i = 0; i < type.length; i++) {
		type[i].onclick = (e) => {
			top = type[i].offsetTop - 20
			left = type[i].offsetLeft;
			loanForm.style.top= `${top}px`;
			loanForm.style.left= `${left}px`;
			loanForm.style.display = "block"
			img = type[i];
			style = img.currentStyle || window.getComputedStyle(img, false)
			bi = style.backgroundImage.slice(4, -1).replace(/["']/g, "");
			loanForm.style.background = `url(${bi}) no-repeat`;
			loanForm.style.backgroundColor = "#fff";
			loanForm.style.backgroundSize = "contain";
			// loanForm.style.transition = "bottom 800ms .2s";
			// loanForm.style.transitionTimingFunction = "cubic-bezier(0.4,0, 1,1)";
			let children = Array.from(type[i].children);
			let loanType = children[0].textContent.trim();
			let loanMax = children[2].textContent.split(" ")[2].toString().split("").slice(0, -9).join("");
			loantype.value = loanType;
		}
	}
})();


let submit = document.querySelector('.submit_app');
let data;
submit.onclick = (e) => {
	postFormData('https://qwikcredit.herokuapp.com/api/v1/loans')
	.then(data => {
		if (data.status === 201) {
			success.textContent = 'successfully applied';
			success.style.display = 'block'
			setTimeout(function() {
				success.style.display = 'none'
			}, 1500)
			localStorage.setItem('loan_id', data.data.id)
		} else if (data.status === 422){
			errorText.textContent = data.message;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)			
		} else if (data.status === 403) {
			errorText.textContent = data.error;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		} else {
			errorText.textContent = data.error;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		}
	})
	.catch(error => console.error(error))

	async function postFormData(url) {
		const formData = new FormData(document.querySelector('.loan_form form'))
		const response = await fetch(url, {
			method: 'POST',
			body: new URLSearchParams(formData),
			headers: new Headers({
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': localStorage.getItem('token')
			})
		});
		return await response.json();
	}
	document.querySelector('.loan_form form').reset();
	document.querySelector('.loan_form').style.display = 'none';
}
