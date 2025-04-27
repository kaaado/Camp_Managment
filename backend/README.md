So easy setup

add a .env file inside put:
-LLM_API_KEY= your api key
-JWT_SECRET= your secret token (can be any u choose)
-override PORT if u want a different port (default 3000)

to run backend hit:
-npm i
-npm start

API are:
localhost:PORT/
-question/llm a post request that require a prompt on the body of the request
-auth/signup to signup post request data on request body
-auth/login to login post request data on request body(with token)
-users/:id get req to get user by id id is a param
-users/name/:name get user by name name is a param
-users/all get all users
-users/all/:num get all users limited number
-users/ post req to add user data on request body
-users/:id put request change user by id id as param data in request body
-users/:id delete to delete a user by id id is a param
