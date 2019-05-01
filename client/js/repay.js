function getRepays(url) {
	return fetch(url, {
	method: 'GET',
	body: new URLSearchParams({status: status_text}),
	headers: new Headers({ 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'})
	}).then(response => response.json())
}