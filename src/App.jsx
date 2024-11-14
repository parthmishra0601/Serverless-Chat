import { useState, useEffect } from 'react';
import './App.css';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, app } from './firebase';

const db = getFirestore(app);
const storage = getStorage(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState(""); // New state for room name
  const [newRoomName, setNewRoomName] = useState("");

  // Fetch rooms on load
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), snapshot => {
      setRooms(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })));
    });
    return unsubscribe;
  }, []);

  // Fetch messages for the selected room
  useEffect(() => {
    if (selectedRoom) {
      const q = query(collection(db, "rooms", selectedRoom, "messages"), orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, snapshot => {
        setMessages(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })));
      });
      return unsubscribe;
    }
  }, [selectedRoom]);

  // Check for authenticated user on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user || null);
    });
    return unsubscribe;
  }, []);

  // Create a new room
  const createRoom = async () => {
    if (!newRoomName) return;
    const docRef = await addDoc(collection(db, "rooms"), { name: newRoomName });
    setNewRoomName("");
    // Optionally select the new room
    setSelectedRoom(docRef.id);
  };

  // Send a new message or file
  const sendMessage = async () => {
    if (!user || !selectedRoom) return;

    let fileURL = null;
    let fileType = null;

    // If a file is selected, upload it to Firebase Storage
    if (file) {
      const fileRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            fileURL = await getDownloadURL(fileRef);
            fileType = file.type;
            resolve();
          }
        );
      });
      setFile(null);
    }

    // Send message with text and/or file
    await addDoc(collection(db, "rooms", selectedRoom, "messages"), {
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
      text: newMessage || null,
      fileURL: fileURL || null,
      fileType: fileType || null,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
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

  // Update selected room's name when a room is selected
  useEffect(() => {
    if (selectedRoom) {
      const room = rooms.find(room => room.id === selectedRoom);
      setSelectedRoomName(room?.name || "");
    }
  }, [selectedRoom, rooms]);

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      {user ? (
        <>
          <div className="absolute top-4 right-4">
            <button
              className="bg-blue-400 text-white rounded-lg px-4 py-2"
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          </div>
          <div className="text-white flex-grow overflow-auto p-4">
            <h2 className="text-center text-2xl mb-4">Welcome to {selectedRoomName || "Firechat"}</h2> {/* Display room name */}
            <div>Logged in as {user.displayName}</div>

            <div className="flex items-center gap-2 my-4">
              <select
                value={selectedRoom || ""}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="p-2 rounded-lg bg-gray-700 "
              >
                <option value="">Select a Chat Room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              <input
                type="text"
                className="p-2 rounded-lg text-black"
                placeholder="New Room Name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <button onClick={createRoom} className="bg-blue-500 p-2 rounded-lg">Create Room</button>
            </div>

            <div className="flex flex-col gap-5 mt-5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.data.uid === user.uid ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-row p-3 gap-3 rounded-2xl items-center ${msg.data.uid === user.uid ? 'text-white bg-blue-500' : 'bg-white'}`}>
                    <img className="w-10 h-10 rounded-full" src={msg.data.photoURL} alt="User" />
                    {msg.data.text && <span>{msg.data.text}</span>}
                    {msg.data.fileURL && (
                      <span className="text-gray-500 italic">File sent: {msg.data.fileType.startsWith("image/") ? "Image" : msg.data.fileType.startsWith("video/") ? "Video" : "Document"}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <input
              type="text"
              className="p-2 border rounded bg-white flex-grow h-12"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={e => setFile(e.target.files[0])}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-gray-200 text-gray-800 p-2 rounded-lg"
            >
              Attach File
            </label>
            <button
              className="rounded-lg bg-blue-400 p-3"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <form onSubmit={handleLogin} className="flex flex-col items-center bg-gray-700 p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-white text-xl mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              type="email"
              className="p-2 border rounded bg-white mb-2 w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="p-2 border rounded bg-white mb-4 w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="bg-blue-400 text-white rounded-lg px-4 py-2 mb-4 w-full">Login</button>
            <button
              className="bg-red-500 text-white rounded-lg px-4 py-2 w-full"
              onClick={handleGoogleLogin}
            >
              Login with Google
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
