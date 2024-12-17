# Currency Exchange Web App

## Description

The Currency Exchange Web App is a web-based application that allows users to view and convert currency exchange rates. It provides real-time exchange rates for various currencies and displays information about different countries and their currencies. The app also allows users to add and remove neighboring countries to compare their exchange rates.

## Features

- **Real-time Exchange Rates**: Fetches the latest exchange rates from the ExchangeRate-API.
- **Country Information**: Displays detailed information about countries, including their currency codes, names, symbols, and borders.
- **Currency Conversion**: Allows users to input an amount and convert it to different currencies.
- **Add/Remove Neighbors**: Users can add or remove neighboring countries to compare their exchange rates.
- **Responsive Design**: The app is designed to be responsive and works well on both desktop and mobile devices.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **EJS**: Templating engine for rendering HTML pages.
- **Axios**: Promise-based HTTP client for making API requests.
- **Bootstrap**: Frontend framework for responsive design.
- **JavaScript**: Programming language for frontend and backend logic.
- **CSS**: Styling for the web pages.

## Setup and Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/antunsimic/currency-exchange.git
   cd currency-exchange
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Create a .env file** and add your API key:
   ```
   API_KEY=your_api_key_here
   ```

4. **Start the server**:
   ```sh
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`.

## Deployment

To deploy the app on Heroku, follow these steps:

1. **Login to Heroku**:
   ```sh
   heroku login
   ```

2. **Create a new Heroku app**:
   ```sh
   heroku create your-app-name
   ```

3. **Push the code to Heroku**:
   ```sh
   git push heroku main
   ```

4. **Set the environment variable**:
   ```sh
   heroku config:set API_KEY=your_api_key_here
   ```

5. **Open the app**:
   ```sh
   heroku open
   ```

## License

This project is licensed under the Source-Available Commercial License (SACL) v1.0. See the LICENSE file for details.

## Author

Antun Simić

## Acknowledgements

- [ExchangeRate-API](https://www.exchangerate-api.com/)
- [Country API](https://country.is/)
- [REST Countries](https://restcountries.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Flag Icons](https://github.com/lipis/flag-icons)
- [Unsplash](https://unsplash.com/) for the background image.
