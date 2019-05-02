const email = document.querySelector('.amount input[name = email]');
const amount = document.querySelector('.amount input[name = paidAmount]');
const repayBtn = document.querySelector('.submit_app');

function repay(url, email, amount) {
	const response = await fetch(url, {
		method: 'POST',
		body: new URLSearchParams({ amount: amount, email: email }),
		headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded',
				      'Authorization': localStorage.getItem('token'),
				     })
	})
	return response.json();
};

repayBtn.onclick = function(_e) {
	repay('https://qwikcredit.herokuapp.com/api/v1/loans/repayments', email.value, amount.value)
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error);
	})
	window.location.reload(true)
}
