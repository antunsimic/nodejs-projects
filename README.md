# NodeJS Projects

This repository contains various NodeJS projects developed by Antun Simić. Each project is designed to demonstrate different aspects of NodeJS, Express, and other related technologies. Below is a brief overview of the projects included in this repository.

## Projects

### 1. StickyNotes
StickyNotes is a web application that allows users to create, edit, and manage notes. It supports user authentication via Google and GitHub, and provides both private and public visibility options for notes.

For more details, please refer to the StickyNotes README.

### 2. CurrencyExchange
CurrencyExchange is a web-based application that allows users to view and convert currency exchange rates. It provides real-time exchange rates for various currencies and displays information about different countries and their currencies.

For more details, please refer to the CurrencyExchange README.

### 3. MovieBackend
MovieBackend is an API that provides movie recommendations based on the user's country and other criteria. It uses the TMDB API to fetch movie data and supports rate limiting and CORS.

### 4. Additional Projects
This repository may contain additional projects that demonstrate various NodeJS and Express functionalities. Each project is contained within its own directory and includes the necessary code and configuration files.

## Setup and Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/antunsimic/nodejs-projects.git
   cd nodejs-projects
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Create a .env file** and add your environment variables:
   ```sh
   touch .env
   ```

   Add the following variables to the .env file:
   ```
   PORT=3000
   SN_DATABASE_USER=your_database_user
   SN_DATABASE_PASSWORD=your_database_password
   SN_SESSION_KEY=your_session_key
   SN_GOOGLE_CLIENT_ID=your_google_client_id
   SN_GOOGLE_CLIENT_SECRET=your_google_client_secret
   SN_GITHUB_CLIENT_ID=your_github_client_id
   SN_GITHUB_CLIENT_SECRET=your_github_client_secret
   CE_API_KEY=your_currency_exchange_api_key
   MR_TOKEN=your_movie_recommendation_api_token
   ```

4. **Start the server**:
   ```sh
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`.

## License

This project is licensed under the Source-Available Commercial License (SACL) v1.0. See the LICENSE file for details.

## Author

Antun Simić

## Acknowledgements

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Passport](http://www.passportjs.org/)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- [ExchangeRate-API](https://www.exchangerate-api.com/)
- [REST Countries](https://restcountries.com/)
- [Flag Icons](https://github.com/lipis/flag-icons)
- [Unsplash](https://unsplash.com/) for background images

For more details on individual projects, please refer to their respective README files.
