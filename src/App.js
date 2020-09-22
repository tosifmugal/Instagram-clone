import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import logo from "./Component/Images/instagram-logo.png";
import './App.css';
import Post from './Component/Post';
import { auth, db } from './firebase';
import ImageUpload from './Component/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [username,setUsername] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [user,setUser] = useState(null);
  const [openSingIn,setOpenSingIn] = useState(false);

  useEffect(()=>{
const unsubscribe = auth.onAuthStateChanged((authUser)=>{
  if(authUser){
    //user has loged
    setUser(authUser);
    // if (authUser.displayName){
    //   //dont update username

    // }
    // else{
    //   //if we just created someone...
    //   return authUser.updateProfile({displayName:username});
    // }
  }
  else{
    //user has loged out....  
    setUser(null);
  }
})
return ()=>{
  //perform some cleanup actions
  unsubscribe();
}
  },[user,username]);

  useEffect(()=>{
db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
setPosts(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})))
})
  },[]);
  const singUp = (e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{ 
    return  authUser.user.updateProfile({displayName:username})
    }).catch(error=>alert(error.message));
    setOpen(false);
  }
  const singIn =e=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password).catch(error=>alert(error.message));
    setOpenSingIn(false);
  }

  
  return (
    <div className="App">
   
   
       <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
      >
          <div style={modalStyle} className={classes.paper}>
           
            <form className="app__singup" >
      <center>
      <img src={logo} alt="img" />
      </center>
        <Input placeholder="username" type="text" onChange={e=>setUsername(e.target.value)} value={username} />
        <Input placeholder="email" type="email" onChange={e=>setEmail(e.target.value)} value = {email} />
        <Input placeholder="password" type="text" onChange={e=>setPassword(e.target.value)} value={password} />
        <Button type="submit" onClick={singUp} >submit</Button>
            </form>
    </div>
      </Modal>
      <Modal
        open={openSingIn}
        onClose={()=>{setOpenSingIn(false)}}
      >
          <div style={modalStyle} className={classes.paper}>
            <form className="app__singup" >

      <center>
      <img src={logo} alt="img" />
      </center>
        <Input placeholder="email" type="email" onChange={e=>setEmail(e.target.value)} value = {email} />
        <Input placeholder="password" type="text" onChange={e=>setPassword(e.target.value)} value={password} />
        <Button type="submit" onClick={singIn} >singIn</Button>
            </form>
    </div>
      </Modal>
      <header className="app__header" >
        <img className="app__headerImage"  src={logo} alt="img" />
        {user ? 
      <Button onClick={()=>{auth.signOut()}}>Logout</Button> :
     <div className="app__loginContainer" >
       <Button onClick={()=>{setOpenSingIn(true)}}>singIn</Button>
       <Button onClick={()=>{setOpen(true)}}>singUp</Button>

     </div>
      }
      </header>
   <div className="app__posts">
     <div className="app__postsLeft">
     {
        posts.map(({id,post})=><Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)
      }
     </div>
     <div className="app__postsRight">
            <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
  </div>
      </div>

{
      user?.displayName ?  (<ImageUpload username ={user.displayName} /> ) : (<h3>sorry need to login</h3>)
      }
     
    </div>
  );
}

export default App;
