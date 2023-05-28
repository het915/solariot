import React from "react";
import logo from "../images/logo4.png";
import "./index.css";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";

const Navbar = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar">
      <img src={logo} alt="" />
      <p>BINIWORLD INNOVATIONS PVT. LTD.</p>
      {user && (
        <div>
          <button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      )}
      <div className="underline"></div>
    </div>
  );
};

export default Navbar;
