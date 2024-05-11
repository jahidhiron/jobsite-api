# JobSite REST API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

As part of my professional experience, I undertook a project to design and develop a job recruiting website. The goal of this project was to create a platform where job seekers could search for job opportunities and employers could post job listings.
<br />
Developed a secure system for job seekers and employers to create and log into their accounts safely.
<br />
Developed a robust job search feature that enables job seekers to filter listings based on specific criteria, including location, industry, and job title.
<br />
Created a job board that allows employers to post job openings with descriptions and requirements, and allows job seekers to submit applications.
<br />
Developed a job application tracking feature for job seekers and employers.

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

This project is licensed under the MIT License.
