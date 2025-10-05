import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/signin";
import SignUp from "./pages/singnup";
import Profile from "./pages/profile";
import Addposts from "./pages/addposts";
import Posts from "./pages/posts"
import EditPost from "./pages/editpost";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={ <Profile /> } />
         <Route path="/posts" element={ <Posts/> } />
          <Route path="/addposts" element={ <Addposts /> } />
          <Route path="/edit/:id" element={<EditPost />} />

       
      </Routes>
    </>
  );
}

export default App;
