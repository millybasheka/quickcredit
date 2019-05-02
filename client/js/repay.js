async function postFormData(url, data) {
	const formData = new FormData(document.querySelector('.sign_up form'))
	const response = await fetch(url, {
		method: 'POST',
		body: new URLSearchParams(formData),
		headers: new Headers({ 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' })
	});
	return await response.json();
}
function getRepays(url) {
	return fetch(url, {
	method: 'GET',
	body: new URLSearchParams({status: status_text}),
	headers: new Headers({ 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})
	}).then(response => response.json())
}
