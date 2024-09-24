import { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
console.log(authService);

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 유저 정보가 있으면 그 유저 정보를 userObj에 저장
  const [userObj, setUserObj] = useState(null);
  // 초기화
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user.uid);
      setIsLoggedIn(true);
      setUserObj(user.uid);
    } else {
      setIsLoggedIn(false);
    }
    setInit(true);
  });
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}></AppRouter>
      ) : (
        "회원정보 확인중..."
      )}
    </>
  );
}

export default App;
