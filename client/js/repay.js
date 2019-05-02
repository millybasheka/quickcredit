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
		console.log(`https://qwikcredit.herokuapp.com/api/v1/loans/${localStorage.getItem('loan_id')}/repayments`)
	})
	.catch(error => {
		console.error(error);
	})
	
}
