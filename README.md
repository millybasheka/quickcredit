# QUICK CREDIT

[![Build Status](https://travis-ci.org/elemanhillary/QuickCredit.svg?branch=develop-v2)](https://travis-ci.org/elemanhillary/QuickCredit)

Quick Credit is an online lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.

## Required Features

- User (client) can **sign up**
- User (client) can **login**
- User (client) can **request for only one loan at a time**
- User (client) can **view loan repayment history, to keep track of his/her liability or responsibilities**
- Admin can **mark a client as verified , after confirming his/her home and work address**
- Admin can **view a specific loan application**
- Admin can **approve or reject a client’s loan application**
- Admin can **post loan repayment transaction in favour of a client**
- Admin can **view all loan applications**
- Admin can **view all current loans (not fully repaid)**
- Admin can **view all repaid loans**


## Technologies

- Node JS
- Express
- Mocha & Chai
- Joi
- ESLint
- Cors
- Travis CI
- Code Climate & Coveralls

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
To run:

- Make sure to run admin and user in different browsers
```sh
git clone <https://github.com/elemanhillary/QuickCredit.git>
cd QuickCredit
npm install
npm start
```

## Testing

```sh
npm run test
```

## API-ENDPOINTS

- V1

`- POST /api/v1/auth/signup Create user account`

`- POST /api/v1/auth/signin Login a user`

`- GET /api/v1/user Get all user`

`- POST /api/v1/loans Create a loan application`

`- GET /api/v1/loans/<:loan-id>/repayments View loan repayment history`

`- GET /api/v1/loans Get all loan applications`

`- GET /api/v1/loans?status=approved&repaid=false Get all current loans that are not fully repaid`

`- GET /api/v1/loans?status=approved&repaid=true Get all repaid loans.`

`- PATCH /api/v1/users/<:user-email>/verify Mark a user as verified`

`- GET /api/v1/loans/<:loan-id> Get a specific loan application`

`- PATCH /api/v1/loans/<:loan-id> Approve or reject a loan application`

`- POST /api/v1/loans/<:loan-id>/repayments Create a loan repayment record`


## Pivotal Tracker stories

[https://www.pivotaltracker.com/n/projects/2327175](https://www.pivotaltracker.com/n/projects/2327175)

## Template UI

You can see a hosted version of the template at [https://elemanhillary.github.io/QuickCredit/](https://elemanhillary.github.io/QuickCredit/)

## API

The API is currently in version 1 (v1) and is hosted at
[https://qwikcredit.herokuapp.com/](https://qwikcredit.herokuapp.com/)

## API Documentation

[https://qwikcredit.herokuapp.com/docs/](https://qwikcredit.herokuapp.com/docs/)

## Author

Eleman Hillary Barnabas

