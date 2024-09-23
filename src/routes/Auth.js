import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 회원가입했을 때, 해당 유저의 정보를 저장할 변수
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  // 인증과 관련된 것들 초기화
  const auth = getAuth();

  const onchange = (e) => {
    // let name = e.target.name;
    // let value = e.target.value;
    // 구조 분해 할당
    const { name, value } = e.target;
    console.log(name, value);

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (newAccount) {
      // 회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    } else {
      // 로그인
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          setError(errorMessage);
        });
    }
  };

  let toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onchange}
          required
        ></input>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onchange}
          required
        ></input>
        <button>{newAccount ? "Create Account" : "Login"}</button>
        {error}
      </form>
      <div onClick={toggleAccount}>
        {newAccount ? "Login" : "Create Account"}
      </div>
    </div>
  );
};
export default Auth;
