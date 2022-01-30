## Hosted Project

[E-Commerce API Heroku URL] ->  https://e-commerce-api-101.herokuapp.com/

e-commerce-api router
 -> auth 
 -> user
 ->product
 ->review
 ->orders
 
auth router
 
https://e-commerce-api-101.herokuapp.com/api/v1/auth/register -> post => public 

https://e-commerce-api-101.herokuapp.com/api/v1/auth/login -> post => public 

https://e-commerce-api-101.herokuapp.com/api/v1/auth/logout -> get => public 

 
user router
 
https://e-commerce-api-101.herokuapp.com/api/v1/users -> get => getAllProducts  => public 

https://e-commerce-api-101.herokuapp.com/api/v1/users/showMe -> get => showCurrentUser => only user

https://e-commerce-api-101.herokuapp.com/api/v1/users/updateUser -> patch => updateUser => only user

https://e-commerce-api-101.herokuapp.com/api/v1/users/updateUsersPassword -> patch => updateUserPassword => only user

https://e-commerce-api-101.herokuapp.com/api/v1/users/:id -> get => getSingleUsers => only user

 
 
products
https://e-commerce-api-101.herokuapp.com/api/v1/products -> get => getAllProducts  => public 

https://e-commerce-api-101.herokuapp.com/api/v1/products -> post => createProduct  => only admin

https://e-commerce-api-101.herokuapp.com/api/v1/products/uploadImage -> post => uploadImage  => only admin

https://e-commerce-api-101.herokuapp.com/api/v1/products/:id -> get => getSingleProduct => public 

https://e-commerce-api-101.herokuapp.com/api/v1/products/:id -> patch => updateProduct => only admin

https://e-commerce-api-101.herokuapp.com/api/v1/products/:id -> delete => deleteProduct => only admin

prodduct review

https://e-commerce-api-101.herokuapp.com/api/v1/products/:id/review -> get => getsingleproductreview


reviews
https://e-commerce-api-101.herokuapp.com/api/v1/reviews -> get => getAllReviews => public 

https://e-commerce-api-101.herokuapp.com/api/v1/reviews -> post => createReview  => only user

https://e-commerce-api-101.herokuapp.com/api/v1/reviews/:id -> get => getSingleReview   => public 

https://e-commerce-api-101.herokuapp.com/api/v1/reviews/:id -> patch => updateReview => only user

https://e-commerce-api-101.herokuapp.com/api/v1/reviews/:id -> delete => deleteReview => only user

 
 

 orders
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders -> post => createOrder => only user
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders -> get => getAllOrders => only admin
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders/showAllMyOrders -> get => getCurrentUserOrders  => only user
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders/:id -> get => getSingleOrder  => only user
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders/:id -> patch => updateOrder => only user
 
 https://e-commerce-api-101.herokuapp.com/api/v1/orders/:id -> delete => deleteOrder => only user
 
      
 
 


