'use strict'

const toggleButtons = () => {
	/*signin btn, login btn, signin form(signin_html), login form(signup_html) elements*/
	let signin_btn = document.querySelector('.login');
	let signup_btn = document.querySelector('.signup');
	let signin_html = document.querySelector('.sign_in');
	let signup_html = document.querySelector('.sign_up');

	/*check whether signin_html has attribute active and display it as active*/
	if (signin_html.hasAttribute('active')) {	
		signup_html.style.display = 'none';
		signin_btn.style.background = '#ffffff';
		signin_btn.firstElementChild.style.color = '#0084d7';
	}

	/* add onclick event listeners on signin_btn and signup_btn */
	signin_btn.onclick = (e) => {
		signin_html.setAttribute('active',true);
		signin_html.style.display = 'block';
		signup_html.style.display = 'none';
		signin_btn.style.background = '#ffffff';
		signin_btn.firstElementChild.style.color = '#0084d7';
		signup_btn.style.background = 'transparent';
		signup_btn.firstElementChild.style.color = '#ffffff';
	}
	signup_btn.onclick = (e) => {
		signin_html.style.display = 'none';
		signup_html.style.display = 'block';
		signup_btn.style.background = '#ffffff';
		signup_btn.style.background = '#ffffff';
		signup_btn.firstElementChild.style.color = '#0084d7';
		signin_btn.style.background = 'transparent';
		signin_btn.firstElementChild.style.color = '#ffffff';
	}
}

// let submit = document.querySelector('#submit_login');

// submit.onclick = (e) => {
// 	postFormData('http://localhost:3000/auth/signin')
// 	.then(data => console.log(data))
// 	.catch(error => console.error(error))

// 	function postFormData(url, data) {
// 		const formData = new FormData(document.querySelector('.sign_in form'))
// 		return fetch(url, {
// 		method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
// 		body: new URLSearchParams(formData),
// 		headers: new Headers({'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'})}).then(response => response.json())
// 	}
// }

(function(){
	toggleButtons();
})();

