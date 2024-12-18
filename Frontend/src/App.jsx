import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { Footer, Navbar } from "./components/index.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser } from "./store/authSlice.js";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

function App() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const url = `${baseUrl}/auth/login/success`;
      const { data } = await axios.get(url,{
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        }
      });
      setUser(data?.user);
      const userData = data?.user;
      const accessToken = data?.user?.accessToken;   
      
      if (accessToken) {
        // Save the accessToken in a cookie
        Cookies.set("accessToken", accessToken, {
          expires: 7, // Expire in 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      }

      console.log("user: ", userData);
      dispatch(loginUser({ userData }));
      navigate("/users/home");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="flex flex-col"></div>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow">
        <Outlet context={{ user, searchTerm }} />
      </main>
      <Footer />
    </>
  );
}

export default App;
