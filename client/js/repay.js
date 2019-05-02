const amount = document.querySelector('.amount input[name = paidAmount]');
const repayBtn = document.querySelector('.submit_app');

async function repay(url, amount) {
	const response = await fetch(url, {
		method: 'POST',
		body: new URLSearchParams({ amount: amount }),
		headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 
				     'Authorization': localStorage.getItem('token'),
				     })
	})
	return await response.json();
};

repayBtn.onclick = function(_e) {
	repay(`https://qwikcredit.herokuapp.com/api/v1/loans/${localStorage.getItem('loan_id')}/repayments`, amount.value)
	.then(data => {
		console.log(data);
		if (data.Success) {
			console.log('yes')
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
	.catch(error => {
		console.error(error);
	})
	
}
