# JobSite REST API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This Node.js API provides developers with easy access to job listings and related data from various job sites. With this API, you can integrate job search functionality into your applications, access job details, filter by location, industry, or job type, and much more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#endpoints)
- [License](#license)

## Installation

Install Redis in Memory Database
Install Postgres SQL Database

```bash
git clone https://github.com/jahidhiron/jobsite-api.git
cd jobsite-api
npm install
cd src/api/v1
npx sequelize-cli db:migrate --name 20240314055004-create-role.js
npx sequelize-cli db:migrate --name 20240314092219-create-user.js
npx sequelize-cli db:migrate --name 20240315060308-create-log.js
```

## Usage

```bash
npm run dev
```

## Features

- Retrieve job listings from multiple job sites
- Filter jobs by location, industry, or job type
- Get detailed information about each job listing
- Perform keyword searches for specific job titles or descriptions
- Flexible and easy-to-use API endpoints
- Scalable and well-documented codebase

## API Endpoints

Look at 'samples/api_collection.json' file for API end point

## License

Specify the license under which your project is distributed. For example:
This project is licensed under the MIT License.
