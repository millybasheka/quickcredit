const submit_app = document.querySelector(".submit_app");
async function postFormData(url) {
	const formData = new FormData(document.querySelector('.repayment_form form'))
	const response = await fetch(url, {
		method: 'POST',
		body: new URLSearchParams(formData),
		headers: new Headers({ 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				      'Authorization': localStorage.getItem('token')
				     })
	});
	return await response.json();
};
function getRepays() {
	postFormData(`https://qwikcredit.herokuapp.com/api/v1/loans/${localStorage.getItem('loan_id')}/repayments`)
	.then(data => {
		console.log(data)
	})
	.catch(error => error);
};

submit_app.onclick = function(e){
	getRepays();
};
