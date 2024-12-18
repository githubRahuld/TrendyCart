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


## Project Snapshots

### Homepage
![Screenshot 2024-12-18 215311](https://github.com/user-attachments/assets/ca1c302f-57b9-45ef-86a3-66ec79515c51)

The homepage provides an overview of the trending products, offers, and navigation to different product categories.

### Product Detail Page
![Screenshot 2024-12-18 220459](https://github.com/user-attachments/assets/348ec4e8-9277-4b91-b535-492511343b4a)

The product detail page showcases individual products with detailed descriptions, pricing, and options to add to the cart.

### Checkout Page
![Screenshot 2024-12-18 220615](https://github.com/user-attachments/assets/d2da830a-4c7c-4bc4-9dcd-81035951da6c)

The cart/checkout page allows users to view their selected products, update quantities, or remove items before proceeding to checkout.

### User Profile/Orders
![Screenshot 2024-12-18 220819](https://github.com/user-attachments/assets/23cff4fd-f91a-4f59-b0ba-2735b12feeb7)

The user profile page shows the user’s account information, order history, and option to manage account settings.

### Payment 
![Screenshot 2024-12-18 220653](https://github.com/user-attachments/assets/2e9a72ea-6f76-47ce-97aa-0690f8dbae23)

User can do payment using Razorpay which has vast options including upi,cards,netbanking ,etc.



