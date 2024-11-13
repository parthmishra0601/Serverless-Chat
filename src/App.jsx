import { useState, useEffect } from 'react';
import './App.css';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, app } from './firebase';

const db = getFirestore(app);

function App() {
  const [user, setUser  ] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch messages on load and listen for updates
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })));
    });
    return unsubscribe;
  }, []);

  // Check for authenticated user on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser  (user);
      } else {
        setUser  (null);
      }
    });
    return unsubscribe;
  }, []);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages
    if (!user) return; // Ensure user is logged in
    try {
      await addDoc(collection(db, "messages"), {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail(""); // Clear email input
      setPassword(""); // Clear password input
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Error during login:", error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      {user ? (
        <>
          <div className="text-white flex-grow overflow-auto p-4">
            <h2 className="text-center text-2xl mb-4">Welcome to Firechat</h2>
            <div>Logged in as {user.displayName}</div>

            <div className="flex flex-col gap-5 mt-5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`message flex ${msg.data.uid === user.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`message flex flex-row p-3 gap-3 rounded-2xl items-center ${msg.data.uid === user.uid ? 'text-white bg-blue-500' : 'bg-white'}`}>
                    <img className="w-10 h-10 rounded-full" src={msg.data.photoURL} alt="User  " />
                    <span>{msg.data.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4">
            <input
              className="p-2 border rounded bg-white"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <div className="flex justify-between">
              <button
                className="rounded-lg bg-blue-400 p-3 mx-2"
                onClick={sendMessage}
              >
                Send Message
              </button>
              <button
                className="bg -blue-400 rounded-lg p-3"
                onClick={() => auth.signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <form onSubmit={handleLogin} className="flex flex-col items-center bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-white mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              type="email"
              className="p-2 border rounded bg-white mb-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="p-2 border rounded bg-white mb-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg mb-2">
              Login
            </button>
            <button onClick={handleGoogleLogin} type="button" className="bg-blue-500 text-white p-3 rounded-lg">
              Login with Google
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;