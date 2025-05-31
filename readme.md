# Property Listing System

A backend REST API for a real estate platform that supports user authentication, property listing and management, favorites functionality, Redis caching, and CSV data import.

## Features:

* User registration and login with JWT authentication
* CRUD operations for properties listing
* Add/remove favorite properties per user
* Import property listings via CSV
* Fast responses with Redis caching
* Modular, maintainable code structure

## Tech Stack Used:

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Caching:** Redis (via Upstash or local instance)
* **Authentication:** bcrypt, JWT
* **CSV Parsing:** csv-parser
* **Environment Variables:** dotenv

## Getting Started

#### Prerequisites:

* Node.js and npm
* MongoDB (local or Atlas)
* Redis (local or [Upstash](https://upstash.com))
* Git

#### Installation:

* git clone https://github.com/motivated-star/task.git
* npm install
* Note:- Make a .env file
  | PORT=5001                                        |
  | ------------------------------------------------ |
  | MONGO_URL=your_mongodb_connection_string         |
  | JWT_SECRET=your_jwt_secret_key                   |
  | UPSTASH_REDIS_REST_URL=your_redis_connection_url |
* Run the server - npm start

#### Project Structure:

| ├── controllers/       # Business logic for routes    |
| :------------------------------------------------------- |
| ├── middlewares/       # Auth and caching middlewares |
| ├── models/            # Mongoose schemas             |
| ├── routes/            # API route definitions        |
| ├── utils/             # CSV import utilities         |
| ├── .env               # Environment variables        |
| ├── server.js          # Entry point                  |
| └── README.md                                         |

#### API Endpoints:

| Method | Endpoint                             |          Description          |
| :----: | ------------------------------------ | :----------------------------: |
|  POST  | `/auth/signup`                     |      Register a new user      |
|  POST  | `/auth/login`                      |      Login and get token      |
|  POST  | `/property/`                       |       Add a new property       |
|  GET  | `/property/`                       |  Get all properties (cached)  |
|  GET  | `/property/:id`                    |      Get a property by ID      |
|  PUT  | `/property/:id`                    |       Update a property       |
| DELETE | `/property/:id`                    |       Delete a property       |
|  POST  | `/property/favorites`              |  Add a property to favorites  |
|  GET  | `/prpoperty/favorites`             |  Get all favorite properties  |
| DELETE | `/property/favorites/:property_id` |     Remove from favorites     |
|  POST  | `/api/import-csv`                  | Upload properties via CSV file |

#### Redis Caching:
* Property listings (GET /property/) are cached.
* Cache is invalidated on POST, PUT, or DELETE.

#### Made By: Aastha Gupta 
