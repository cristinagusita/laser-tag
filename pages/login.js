import PageHeader from "../components/general/pageheader"
import React, { useState, useEffect } from "react";
import Router from "next/router"
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {
    NotificationContainer,
    NotificationManager,
  } from "react-notifications";

  let auth = getAuth()
onAuthStateChanged(auth, (user)=>{

if(user){
    Router.push("/")
}

})

export default function Login(){
    let [loginFormData, setLoginFormData] = useState({
        email:'',
        password:''
    })

    let updateLoginData = (e)=>{
        setLoginFormData({
            ...loginFormData,
            [e.target.name]: e.target.value,
          });
    }

    let login = (e)=>{
        e.preventDefault();
        let email = loginFormData.email
        let password = loginFormData.password

        let email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

        let is_login_data_valid = true;

        if(!(email_regex.test(email))){
            NotificationManager.error("Your email is not valid");
            is_login_data_valid = false;
        }

        if(password.length < 10){
            NotificationManager.error("Your password needs to be at least 10 characters long");
            is_login_data_valid = false;
        }

        if(!is_login_data_valid) return;
        let auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
            NotificationManager.info("Succesfully logged in!")
        }).catch((error) =>{
            NotificationManager.error(error.message);
        })
        

    }

    return (
        <>
            <title>Login</title>
            <PageHeader title = "Login to your account"/>
            <form onSubmit = {login} onChange = {updateLoginData}>
                <span>
                    <label>
                        Email:
                    </label>
                    <input type = 'email' name = 'email' placeholder =  'Your email address'/>
                </span>
                <span>
                    <label>
                        Password:
                    </label>
                    <input type = 'password' name = 'password' placeholder = 'Your password'/>
                </span>
                <span>
                    <button>Login</button>
                </span>
            </form>
        </>
    )
}