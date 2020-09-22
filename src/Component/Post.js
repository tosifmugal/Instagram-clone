import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';
import InstagramIcon from '@material-ui/icons/Instagram';
import { Button, Input } from '@material-ui/core';

function Post({postId,user,username,caption,imageUrl}) {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState("");
    useEffect(()=>{
        let unsubscribe ;
        if(postId){
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy('timestamp','desc').onSnapshot((snapshot)=>{setComments(snapshot.docs.map((doc)=>doc.data()));});
      
        }
        return ()=>{
            unsubscribe();
            
        };
        
        
      },[postId]);
  
   

    const postComment =e=>{
        e.preventDefault();
        
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
            
        });
        
        setComment("");
    }

    return (
        <div className="post">
            <div className="post__header">

            <Avatar className="post__avatar" alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <h1>{username}</h1>
            </div>
            <img src={imageUrl} alt="imges" className="post__image" />
            <h4 className="post__text"><strong>{username}</strong>{caption}</h4>
            <div className="post__comments">
            {
              comments.map(comment=>(<p><strong>{comment.username}</strong>  {comment.text}</p>))
                }
            </div>
            {user && (<form className="post__commentBox">
                <Input className="post__input" type="text" placeholder="Add a comment" value={comment} onChange={e=>setComment(e.target.value)} />
                <Button disabled={!comment} className="post__button" type="submit" onClick={postComment}><InstagramIcon /></Button>

            </form>)}
          
             
        </div>
    )
}

export default Post;
