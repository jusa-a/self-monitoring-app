# Self-Monitoring application

Self-monitoring web application for reporting daily behavior. The application provides functionality for summarization of reported data. Each user can view statistics of their reports on a weekly and monthly level.

[Self-Monitoring-app](https://self-monitoring--app.herokuapp.com/) (Link to the application running in Heroku)

## Built With

-   [Deno](https://deno.land/) - Javascript runtime
-   [Oak](https://github.com/oakserver/oak) - Web application framework for Deno
-   [PostgreSQL](https://www.postgresql.org/) - Database
-   [EJS](https://ejs.co/) - Templating language/engine
-   [Bootstrap](https://getbootstrap.com) - Style Library
-   [Heroku](https://www.heroku.com/) - Platform

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install Deno

Use the following CREATE TABLE statements to create the database (PostgreSQL) for building and testing the application.

```
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(320) NOT NULL,
	password CHAR(60) NOT NULL
);

CREATE UNIQUE INDEX ON users((lower(email)));

CREATE TABLE reports (
	id SERIAL PRIMARY KEY,
	date TIMESTAMP WITH TIME ZONE NOT NULL,
	type CHAR(7) NOT NULL,
	sleep_duration NUMERIC(4, 2),
	sleep_quality INTEGER,
	exercise_time NUMERIC(4, 2),
	study_time NUMERIC(4, 2),
	eat_quality INTEGER,
	mood INTEGER NOT NULL,
	user_id INTEGER REFERENCES users(id)
);

CREATE UNIQUE INDEX ON reports(date, type, user_id);
```

### Running the application locally

Pass the url of your database as an environmental variable DATABASE_URL during the application launch.

```
DATABASE_URL=your-database-url  deno run --allow-all --unstable app.js
```

open http://localhost:7777 with your browser to use the application

### Testing

There is no need to create separate database for testing because the tests don't alter the database tables.

To run the automated testing set an environmental variable TEST_ENVIRONMENT=true.

Pass also the url of your database as an environmental variable DATABASE_URL during the test launch.

```
TEST_ENVIRONMENT=true DATABASE_URL=your-database-url deno test --allow-all
```

## Features

### Users

-   Users can register to the application
    -   Registration form is accessible at `/auth/registration`
    -   Email is validated
-   Email and password stored in the database for each user
    -   Passwords hashed using BCrypt
    -   Emails must be unique

### Authentication

-   Application uses session-based authentication
-   Login form is accessible at `/auth/login`
-   Logout functionality is at `/auth/logout`

### Middleware

-   Application has middleware for logging errors
-   Application has middleware for logging requests
-   The application has middleware that controls access to the application
    -   Landing page at `/` is accessible to all
    -   Paths starting with `/api` are accessible to all
    -   Paths starting with `/auth` are accessible to all
    -   Other paths require that the user is authenticated
        -   Non-authenticated users are redirected to the login form at `/auth/login`
-   Application has middleware that controls access to static files

### Landing page

-   Landing page shows users' average mood for today and and yesterday
-   Landing page shows a glimpse at the data and indicates a trend

### Reporting

-   Reporting functionality is available under the path `/behavior/reporting`
    -   User can choose to report morning or evening activities
    -   Page shows whether morning and/or evening reporting for current day has already been done
-   Reported values are stored into the database
    -   Reporting is user-specific (all reported values are stored under the currently authenticated user)
    -   If the same report is already given (e.g. morning report for a specific day), then the older report is updated with the new values

### Summarization

-   Summary functionality is available under the path `/behavior/summary`
-   Main summary page contains averages of the statistics,
    -   By default shown for the last week and month
    -   Summarization page contains statistics only for the current user.
    -   Summary data/averages calculated within the database
-   Summary page has a selector for week and month.
    -   If no data for the given week/month exists, the summary informs about that
        If no data for the given month exists, the monthly summary shows text suggesting that no data for the given month exists.

### Security

-   Passwords hashed using BCrypt
-   Field types in the database match the actual content (i.e., when storing numbers, use numeric types)
-   Database queries done using parameterized queries
-   Data retrieved from the database are sanitized
-   Users cannot access data of other users
-   Users cannot post reports to other users' accounts.

### APIs

-   Application provides an API endpoint accessible by all for retrieving summary data generated over all users in a JSON format
    -   Endpoint `/api/summary` provides a JSON document with activities averaged over the last 7 days
    -   Endpoint `/api/summary/:year/:month/:day` provides a JSON document with averages for the given day
-   The API allows cross-origin requests

### Database

-   Expensive calculations such as calculating averages are done in the database
-   Database uses a connection pool

### Testing

-   The application has simple automated tests

### Deployment

-   Application is available and working in Heroku: [Self-Monitoring-app](https://self-monitoring--app.herokuapp.com/)
-   Application can be run locally following the guidelines in documentation

### Application structure

-   Dependencies exported from deps.js
-   Project launched from app.js in the root folder
-   Configurations in config folder
    -   Configurations loaded from environmental variables
    -   Test configurations separate from production configurations

```
self-monitoring-app
├── config
│   └── config.js
├── database
│   └── database.js
├── middlewares
│   └── middlewares.js
├── routes
│   ├── apis
│   │   └── summaryApi.js
│   ├── controllers
│   │   ├── mainController.js
│   │   ├── reportController.js
│   │   ├── summaryController.js
│   │   └── userController.js
│   └── routes.js
├── services
│   ├── reportService.js
│   ├── summaryService.js
│   └── userService.js
├── static
├── tests
│   ├── apis
│   │   └── summaryApi_test.js
│   ├── controllers
│   │   ├── mainController_test.js
│   │   ├── reportController_test.js
│   │   ├── summaryController_test.js
│   │   └── userController_test.js
│   └── middlewares
│       └── middlewares_test.js
├── utils
├── views
│   ├── partials
│   │   ├── error.ejs
│   │   ├── eveningReport.ejs
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   │   ├── morningReport.ejs
│   │   ├── navbar.ejs
│   │   ├── notif.ejs
│   │   └── summaryList.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── reporting.ejs
│   └── summary.ejs
├── Procfile
├── README.md
├── app.js
├── deps.js
└── runtime.txt

15 directories, 36 files
```
