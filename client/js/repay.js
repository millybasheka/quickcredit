let submit = document.querySelector('.submit_app');
let amount = document.querySelector('.amount input[name = paidAmount]')
submit.onclick = (e) => {
	postFormData(`https://qwikcredit.herokuapp.com/api/v1/loans/${localStorage.getItem('loan_id')}/repayments`)
	.then(data => {
console.log(data)
		if (data.status === 201) {
			console.log(data)
		} else if (data.status === 422){
			errors.textContent = data.message;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)			
		} else if (data.status === 403) {
			errors.textContent = data.error;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		} else if (data.status === 404) {
			errors.textContent = "loan not verified or not found";
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
	        } else {
			errors.textContent = data.error;
			errors.style.display = 'block'
			setTimeout(function() {
				errors.style.display = 'none'
			}, 1500)
		}
	})
	.catch(error => console.error(error))

	async function postFormData(url) {
		const response = await fetch(url, {
			method: 'POST',
			body: new URLSearchParams({amount: amount.value}),
			headers: new Headers({
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Authorization': localStorage.getItem('token')
			})
		});
		return await response.json();
	}
	document.querySelector('.repayment_form form').reset()
}
