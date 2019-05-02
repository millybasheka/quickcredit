const submit_app = document.querySelector(".submit_app");
submit_app.onclick = (e) => {
	postFormData(`https://qwikcredit.herokuapp.com/api/v1/loans/${localStorage.getItem('loan_id')}/repayments`)
	.then(data => {
		console.log(data);
		if (data.Success) {
			if(data.data.isAdmin) {
				window.location.href = 'https://elemanhillary.github.io/QuickCredit/admin/'
			} else {
				window.location.href = 'https://elemanhillary.github.io/QuickCredit/client/';
			}
		} else if (data.status === 422){
			errors.textContent = data.message;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)			
		} else {
			errors.textContent = 'Authentication failed';
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		}
	})
	.catch(error => console.error(error))

	async function postFormData(url, data) {
		const formData = new FormData(document.querySelector('.repayment_form form'))
		const response = await fetch(url, {
			method: 'POST',
			body: new URLSearchParams(formData),
			headers: new Headers({
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': localStorage.getItem('token'),
			})
		});
		return await response.json();
	}
}

