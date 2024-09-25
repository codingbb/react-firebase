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
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [attachment, setAttachment] = useState();
  const storage = getStorage();
  const storageRef = ref(storage);
  let attachmentUrl = "";

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
    const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);

    // url이 들어오면 할 일
    const makePost = async (url) => {
      try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "posts"), {
          content: post,
          date: serverTimestamp(),
          uid: userObj.uid,
          attachmentUrl: url, // attachment의 필드에 url이 들어오도록 바꾼다.
          name: userObj.displayName,
        });
        // console.log("Document written with ID: ", docRef.id);
        setAttachment(""); // base64 쫙~ 나왔던걸 비워주는 것임
        myForm.reset();
        setPost("");
      } catch (e) {
        console.error("error ", e);
      }
    };

    if (attachment) {
      // 첨부한 이미지에 절대 경로를 출력해주는 애가 작동
      uploadString(storageRef, attachment, "data_url").then(
        async (snapshot) => {
          // console.log("Uploaded a data_url string!");
          // console.log(await getDownloadURL(storageRef));
          attachmentUrl = await getDownloadURL(storageRef);
          // 첨부파일 url 을 인수로 전달
          makePost(attachmentUrl);
        }
      );
    } else {
      // 위에 let attachmentUrl = ""; 있으니 빈값이 들어가겠죠
      makePost(attachmentUrl);
    }
  };

  let myForm = document.querySelector("form");

  const onFileChange = (e) => {
    // const theFile = e.target.files[0];
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    // console.log(theFile);

    if (theFile.size > 2 * 1024 * 1024) {
      alert("파일 사이즈는 2MB를 넘을 수 없습니다.");
      myForm.reset();
    } else {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        console.log(e);
        const {
          target: { result },
        } = e;
        setAttachment(result);
      };
      reader.readAsDataURL(theFile);
    }
  };
  console.log(attachment);
  const onClearFile = () => {
    setAttachment(null);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>
          <input
            type="text"
            value={post}
            placeholder="새 포스트를 입력하세요"
            onChange={onChange}
          ></input>
          <input type="file" accept="image/*" onChange={onFileChange}></input>
        </p>
        {attachment && (
          <>
            <img src={attachment} width="100px" alt="" />
            <button type="button" onClick={onClearFile}>
              업로드 취소
            </button>
          </>
        )}
        <p>
          <button type="submit">등록</button>
        </p>
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
