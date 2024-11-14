Serverless Chatting Application
This is a serverless chatting application built using ReactJS, Vite, and Firebase. It allows users to send real-time messages, create chat rooms, and share files, all without the need for a backend server. Firebase Authentication is used for user login, Firebase Firestore handles message storage, and Firebase Storage is used to upload and retrieve files.

Features
Real-time messaging: Send and receive messages instantly.
User Authentication: Login using email/password or Google sign-in.
Multiple Chat Rooms: Create new chat rooms and switch between them.
File Sharing: Share images, videos, and documents with other users.
Responsive Design: Works on both desktop and mobile devices.
Technologies Used
ReactJS: A JavaScript library for building user interfaces.
Vite: A build tool that provides a fast and optimized development environment for ReactJS.
Firebase:
Firebase Authentication: Handles user login and authentication.
Firebase Firestore: A NoSQL database to store and retrieve messages and chat rooms.
Firebase Storage: Used to upload and download files (images, videos, etc.).
Tailwind CSS: A utility-first CSS framework for styling.
Prerequisites
Before running this project locally, you need to:

Have Node.js installed on your computer (Download from nodejs.org).
Have a Firebase account and create a project on Firebase Console.
Set up Firebase Authentication, Firestore, and Firebase Storage in your Firebase project.
Setup
1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/serverless-chat-app.git
cd serverless-chat-app
2. Install Dependencies
Run the following command to install the necessary dependencies:

bash
Copy code
npm install
3. Configure Firebase
Create a .env file in the root of your project and add your Firebase configuration details.
env
Copy code
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
You can find these credentials in the Project Settings of your Firebase Console.

4. Start the Development Server
Run the following command to start the development server:

bash
Copy code
npm run dev
This will start the app on http://localhost:3000.

Features Walkthrough
1. Login Page
Users can log in using their email and password or by using Google sign-in.
After login, the user will be redirected to the chat interface.
2. Chat Room Interface
Once logged in, the user can:
Select a chat room from the dropdown or create a new chat room by providing a room name.
Send messages by typing in the text input and clicking the Send button.
Attach and send files by selecting a file from the file input.
View messages from other users in real time.
3. Logout
Users can log out by clicking the Logout button, which will sign them out of the app.
Deployment
This project is deployed using Vercel, which makes the deployment process simple and efficient.

Steps to Deploy with Vercel
Create an account on Vercel: If you don’t already have an account, sign up at Vercel.

Install Vercel CLI (Optional): You can deploy your project directly from your terminal using the Vercel CLI. To install it, run:

bash
Copy code
npm install -g vercel
Deploy the project:

Navigate to your project directory and run the following command to deploy:

bash
Copy code
vercel
The Vercel CLI will ask you for a few configurations (like linking to your Vercel account, selecting the project, and setting the deployment details).

Configure Firebase in Vercel:

You need to set your Firebase credentials in Vercel's environment variables.
Go to your Vercel dashboard, find your project, and set the following environment variables:
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
Visit your deployed app: After deployment, Vercel will provide a URL where your app is live.

