import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import profile from "../profile_icon.svg";
import "../App.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import Post from "../components/Post";

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState(profile);
  const [posts, setPosts] = useState([]);

  const onLogoutClick = () => {
    signOut(auth)
      .then(() => {
        alert("로그아웃 되었습니다");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserPost = () => {
    const q = query(
      collection(db, "posts"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
      limit(10)
    );
    onSnapshot(q, (querySnapshot) => {
      // 새로운 배열을 만드는 거니까 map 사용
      const postArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(postArr);
      setPosts(postArr);
      // console.log(posts);
    });
  };

  useEffect(() => {
    user.photoURL.includes("firebase") && setProfileImg(user.photoURL);
    getUserPost();
  }, []);

  const updateLogo = async (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    // stroage에 저장하기 위해서 초기화
    const storage = getStorage();
    // storage에 저장할 위치를 지정
    const profileLogoRef = ref(storage, `profiles/${user.uid}`);
    // 업로드한 결과가 result에 저장
    const result = await uploadBytes(profileLogoRef, file);
    // 저장된 결과 result의 절대 주소 url을 받아옴
    const profileUrl = await getDownloadURL(result.ref);
    // console.log(profileUrl);
    setProfileImg(profileUrl);
    await updateProfile(user, {
      photoURL: profileUrl,
    });
  };
  console.log(auth);

  return (
    <>
      <div className="profile">
        <div>
          <img src={profileImg} alt="logo" />
          <h3>{user.displayName}</h3>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          id="profile"
          onChange={updateLogo}
        ></input>
        <label htmlFor="profile">프로필 사진 변경</label>
      </div>
      <button onClick={onLogoutClick}>Logout</button>
      <hr />
      <h3>My Post List</h3>
      <ul className="postlist">
        {posts.map((item) => (
          <Post key={item.id} postObj={item} isOwner={item.uid === user.uid} />
        ))}
      </ul>
    </>
  );
};
export default Profile;
