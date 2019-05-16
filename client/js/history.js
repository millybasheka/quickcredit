const clientsArea = Array.from(document.querySelectorAll('.list_loantype'))
const cardd = document.querySelector('.card')
const children = Array.from(cardd.children).splice(4,4)
function getRepays(url) {
	return fetch(url, {
	method: 'GET',
	headers: new Headers({ 'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			     'Authorization': localStorage.getItem('token'),
			     })
	}).then(response => response.json())
}

			for(let i = 0; i < children.length; i++){
				children[i].style.display = 'none'
				
			}
	getRepays('https://qwikcredit.herokuapp.com/api/v1/compiled')
	.then(data => {
		console.log(data)
		clientsArea[0].innerHTML = ''
		clientsArea[1].innerHTML = ''
		const dat = data.loans
		const repay = data.repays
		if(dat === undefined || repay === undefined){
			for(let i = 0; i < children.length; i++){
				children[i].style.display = 'none'
				
			}
			cardd.insertAdjacentHTML('beforeend','<img class="nodata" src="../client/assets/images/nodata.svg" alt="no data"/>')
		} else {
			
			for(let i = 0; i < children.length; i++){
				children[i].style.display = 'block'
				
			}
		for (let i = 0; i < dat.length; i++){
			clientsArea[1].insertAdjacentHTML('beforeend',
	`
	<li class="clients-card">
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Type: </span><span class="currency">${dat[i].loanType}</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Amount: </span><span class="currency">${dat[i].amount}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Interest: </span><span class="currency">${dat[i].interest}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="created_at"><span class="created_text">Created at: </span><span class="data">${dat[i].createdOn}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified  margin_it"><span class="status_text">Status: </span><span class="status_value">${dat[i].status}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified"><span class="repaid_text">Repaid: </span><span class="repaid_value">${dat[i].repaid}</span></h6>
	</div>
	<div class="description">
	<h6 class="verified"><span class="balance_text">Balance: </span><span class="balance_value">${dat[i].balance} (Loan amount plus Interest)</span></h6>
	</div>
	</li>
	`)
		}
	for (let i = 0; i < repay.length; i++){
		clientsArea[0].insertAdjacentHTML('beforeend',
	`
	<li class="clients-card">
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Type: </span><span class="currency">${repay[i].loanType}</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Loan Amount: </span><span class="currency">${repay[i].amount}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Monthly Pay: </span><span class="currency">${repay[i].monthlyInstallment}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Paid Amount: </span><span class="currency">${repay[i].paidAmount}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="loaned_amount"><span class="loaned_amount_text">Remaining Balance: </span><span class="currency">${repay[i].balance}</span><span class="currency_symbol"> UGX</span></h6>
	</div>
	<div class="description">
	<h6 class="created_at"><span class="created_text">Created at: </span><span class="data">${repay[i].createdOn}</span></h6>
	</div>
	</li>
	`)
		}
		}
	})
