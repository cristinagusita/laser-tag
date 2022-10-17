import PageHeader from "../components/general/pageheader"
import React, { useState, useEffect } from "react";
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged} from "firebase/auth"
import {
    NotificationContainer,
    NotificationManager,
  } from "react-notifications";
import Router from 'next/router'

let auth = getAuth()
onAuthStateChanged(auth, (user)=>{

if(user){
    Router.push("/")
}
})

export default function Register(){
    let [registerFormData, setRegisterFormData] = useState({
        email:'',
        password:''
    })

    let updateRegisterData = (e)=>{
        setRegisterFormData({
            ...registerFormData,
            [e.target.name]: e.target.value,
          });
    }

    let register = (e)=>{
        e.preventDefault();
        let email = registerFormData.email
        let password = registerFormData.password

        let email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

        let is_register_data_valid = true;

        if(!(email_regex.test(email))){
            NotificationManager.error("Your email is not valid");
            is_register_data_valid = false;
        }

        if(password.length < 10){
            NotificationManager.error("Your password needs to be at least 10 characters long");
            is_register_data_valid = false;
        }

        if(!is_register_data_valid) return;
        let auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password).then((userCredential)=>{
            NotificationManager.info("Succesfully registered")
            NotificationManager.info("You have been authomatically logged in")
        }).catch((error) =>{
            NotificationManager.error(error.message);
        })
        

    }

    return (
        <>
            <title>Register</title>
            <PageHeader title = "Create an account"/>
            <form onSubmit = {register} onChange = {updateRegisterData}>
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
                    <button>Register</button>
                </span>
            </form>
        </>
    )
}