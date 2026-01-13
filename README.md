# AskVision 

AskVision is an **AI-powered ChatGPT-like web application** built using the **MERN stack**, designed to provide intelligent, real-time conversational responses. The application integrates OpenAI APIs, secure authentication, media handling, and payment functionality to deliver a complete, production-ready AI chat platform.

Live Demo: https://ask-vision-erzw.vercel.app/login

---

##Features

- **AI-Powered Chat**
  - Integrated with OpenAI APIs to generate intelligent, real-time responses.
  - Smooth conversational experience similar to ChatGPT.

- **Secure Authentication**
  - JWT-based authentication for user login and session management.
  - Secure RESTful APIs for protected routes.

- **Chat History Management**
  - Stores user chat history in the database.
  - Enables users to continue conversations across sessions.

- **Image Upload & Optimization**
  - Integrated **ImageKit** for efficient image uploads.
  - Optimized media handling to reduce load times and improve performance.

- **Payment & Subscriptions**
  - Razorpay payment gateway integration.
  - Supports secure transactions and subscription-based access.

- **Responsive UI**
  - Built using ReactJS.
  - Fully responsive and optimized for all screen sizes and devices.

---

## Tech Stack

**Frontend**
- ReactJS
- HTML5, CSS3, JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Authentication**
- JSON Web Tokens (JWT)

**Third-Party Services**
- OpenAI API (AI responses)
- ImageKit (Image storage & optimization)
- Razorpay (Payments & subscriptions)

---

## Installation & Setup

### Clone the repository
Backend:-
cd server
npm install

Frontend:-
cd client
npm install


**Start Backend Server**
cd server
npm start

**Start Frontend**
cd client
npm start


**Create a .env file in the server directory and add**
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret




git clone https://github.com/Sumitasawa/AskVision.git
cd AskVision
