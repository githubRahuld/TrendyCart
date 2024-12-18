# Trendy Cart

[Trendy Cart](https://trendy-cart-murex.vercel.app) is an e-commerce web application built with modern web technologies. This project allows users to browse products, add items to the cart, and make purchases seamlessly. It provides an intuitive shopping experience with secure user authentication, user profiles, and order management. Trendy Cart is designed to be highly scalable and responsive, making it accessible on both desktop and mobile devices.

## Features

- **User Authentication**: Users can sign up, log in, and manage their profile with secure authentication.
- **Product Catalog**: View a variety of products with their details and prices.
- **Shopping Cart**: Add, remove, and view items in the cart.
- **Order Management**: Place orders and manage them from your profile.
- **Responsive Design**: The app is optimized for both desktop and mobile devices.
- **Payment Integration**: Integrated with a secure payment gateway for order processing.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for storing user and product data)
- **Authentication**: JWT (JSON Web Tokens) for user login and session management
- **State Management**: Redux (for global state management)
- **Session Management**: Redis with express-session for scalable session management

## Installation

Follow these steps to set up the project on your local machine:

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/)
- **MongoDB**: You'll need access to a MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based MongoDB or run a local MongoDB server.

### Steps to Install

1. Clone the repository:

   ```bash
     git clone https://github.com/githubRahuld/TrendyCart.git
     cd TrendyCart
   ```

2. Install dependencies for both the backend and frontend.
   - Backend:

  ```bash
    cd backend
    npm install
  ```
  - Frontend:
  ```bash
    cd frontend
    npm install
  ```
3. Set up environment variables:
  - Create a .env file in the backend directory.
  - Define the following environment variables:
    
  ```makefile
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ACCESS_TOKEN_SECRET
    ACCESS_TOKEN_EXPIRY
    REFRESH_TOKEN_SECRET
    REFRESH_TOKEN_EXPIRY
    CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    SERVER_URL
    CLIENT_URL
    RAZORPAY_KEY_ID
    RAZORPAY_KEY_SECRET
    
4. Run both backend and frontend servers.

  - Backend:
  ```bash
    cd backend
    npm run dev
  ```

  - Frontend:
  ```bash
    cd frontend
    npm run dev
  ```

## The app will be accessible at http://localhost:5173 for the frontend and http://localhost:4000 for the backend.
