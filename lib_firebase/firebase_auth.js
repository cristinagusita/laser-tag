import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhUVBi91Drakxm_28lKSYR1bQIRYMssTo",
  authDomain: "laser-tag-66c19.firebaseapp.com",
  projectId: "laser-tag-66c19",
  storageBucket: "laser-tag-66c19.appspot.com",
  messagingSenderId: "1084099463361",
  appId: "1:1084099463361:web:0e605b5a205e2b02852c40"
};  


const fb_app = initializeApp(firebaseConfig);

export const auth = getAuth(fb_app);
