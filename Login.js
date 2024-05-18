import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firebase } from "./firebase";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const encode_user = (text, shift) => {
    let result = "";

    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
        let code = text.charCodeAt(i);
        // Uppercase letters
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Lowercase letters
        else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      result += char;
    }

    let binaryString = "";
    for (let i = 0; i < text.length; i++) {
      // Convert each character to its Unicode value and then to binary
      let binaryChar = text[i].charCodeAt(0).toString(2);
      // Pad the binary representation to ensure it's 8 bits long
      binaryChar = binaryChar.padStart(8, "0");
      // Concatenate to the result string
      binaryString += binaryChar;
    }
    return binaryString;
  };

  const onButtonClick = async () => {
    setUserError("");
    setPasswordError("");

    if (user === "") {
      setUserError("Please enter your user");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    let decode_user = encode_user(user, 4);
    let decode_pass = Math.round(password * 5 + 62241563 / 7);
    let temp = {};
    const snapshot = await getDocs(
      query(collection(firebase, "users"), where("password", "==", decode_pass))
    );
    snapshot.forEach((doc) => {
      temp = doc.data();
    });

    if (Object.keys(temp).length === 0) {
      setPasswordError("Password incorrect!");
      return;
    }

    if (temp.user !== decode_user) {
      setUserError("User name incorrect!");
      return;
    }

    navigate("/quan-li-doi-xe");
  };

  return (
    <div className="mainContainer">
      <div className="loginBox">
        <div className="titleContainer">
          <div className="title">Login 🔐</div>
        </div>
        <div className="inputContainer">
          <input
            value={user}
            placeholder="Enter your user here"
            onChange={(ev) => setUser(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{userError}</label>
        </div>
        <div className="inputContainer">
          <input
            value={password}
            type="password"
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <div className="inputContainer">
          <input
            className="inputButton"
            type="button"
            onClick={onButtonClick}
            value="Log in"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
