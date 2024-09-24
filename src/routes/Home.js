import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import Post from "../components/Post";

const Home = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  // const getPosts = async () => {
  //   const querySnapshot = await getDocs(collection(db, "posts"));
  //   querySnapshot.forEach((doc) => {
  //     // console.log(doc.data());
  //     const postObj = {
  //       ...doc.data(),
  //       id: doc.id,
  //     };
  //     // 이전의 내용을 prev로 받는다 => 이전의 내용을 그대로 가져와서 새로운 내용을 추가
  //     setPosts((prev) => [postObj, ...prev]);
  //   });
  // };
  useEffect(() => {
    // getPosts();
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    onSnapshot(q, (querySnapshot) => {
      // 새로운 배열을 만드는 거니까 map 사용
      const postArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(postArr);
    });
  }, []);
  console.log(posts);

  const onChange = (e) => {
    // 사용자가 입력한 내용을 value에 저장한 것
    const {
      target: { value },
    } = e;
    // console.log(value);
    setPost(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "posts"), {
        content: post,
        date: serverTimestamp(),
        uid: userObj,
      });
      console.log("Document written with ID: ", docRef.id);
      setPost("");
    } catch (e) {
      console.error("error ", e);
    }
  };

  const onFileChange = (e) => {
    // const theFile = e.target.files[0];
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    console.log(theFile);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={post}
          placeholder="새 포스트를 입력하세요"
          onChange={onChange}
        ></input>
        <input type="file" accept="image/*" onChange={onFileChange}></input>
        <button type="submit">등록</button>
      </form>
      <hr></hr>
      <h3>Post List</h3>
      <ul>
        {posts.map((item) => (
          <Post key={item.id} postObj={item} isOwner={item.uid === userObj} />
        ))}
      </ul>
    </div>
  );
};
export default Home;
