import React, { useState } from "react";
import { db } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Post = ({ postObj, isOwner }) => {
  const [edit, setEdit] = useState(false);
  const [newPost, setNewPost] = useState(postObj.content);

  const deletePost = async () => {
    const yes = window.confirm("정말 삭제하시겠습니까?");
    if (yes) {
      await deleteDoc(doc(db, "posts", postObj.id));
      const storage = getStorage();
      // 지우고자 하는게 누구인지 콕 찝어서 참조 생성!
      const storageRef = ref(storage, postObj.attachmentUrl);
      deleteObject(storageRef);
    }
  };
  const toggleEditMode = () => setEdit((prev) => !prev);

  const onChange = (e) => {
    // e의 target 내용을 value라는 변수에 저장
    const {
      target: { value },
    } = e;
    setNewPost(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const postRef = doc(db, "posts", postObj.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(postRef, {
      content: newPost,
    });
    setEdit(false);
  };

  return (
    <li>
      {edit ? (
        <>
          <form onSubmit={onSubmit}>
            <input value={newPost} required onChange={onChange}></input>
            <button>입력</button>
          </form>
          <button onClick={toggleEditMode}>취소</button>
        </>
      ) : (
        <>
          <h4>{postObj.content}</h4>
          <h5>- {postObj.name} -</h5>
          {postObj.attachmentUrl && (
            <img src={postObj.attachmentUrl} width="100px" alt="" />
          )}
          {isOwner && (
            <>
              <button onClick={deletePost}>삭제</button>
              <button onClick={toggleEditMode}>수정</button>
            </>
          )}
        </>
      )}
    </li>
  );
};
export default Post;
