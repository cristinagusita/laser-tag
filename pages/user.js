import PageHeader from "../components/general/pageheader";
import styles from "../styles/user.module.css";
import { useEffect, useState } from "react";
import Router from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function User() {
  let [pastReservations, setPastReservations] = useState([]);
  let [futureReservations, setFutureReservations] = useState([]);
  let [specialReservations, setSpecialReservations] = useState([])
  let db = getFirestore();
  let auth = getAuth();
  let _user = null;
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        Router.push("/login");
      } else {
        _user = user;

        let pastRes = []
        let futureRes = []
        let specialRes = []
        let now = (new Date()).getTime()
        getDocs(collection(db, "booked_packets")).then((data)=>{
          data.docs.forEach((doc)=>{
            if(doc.data().uid != _user.uid) return;
            let name = doc.data().name
            specialRes.push(<span>{name}</span>)
          })
        })
        setSpecialReservations(specialRes)
        getDocs(collection(db, "bookings")).then((data) => {
          data.docs.forEach((doc) => {
            if(doc.data().uid != _user.uid) return;
            let data = doc.data()
            let unix_time = data.date
            let date_obj = new Date(data.date)
            let day =date_obj.getDate()
            let year = date_obj.getFullYear()
            let month = date_obj.getMonth() + 1
            let hour = date_obj.getHours()
            let minutes = date_obj.getMinutes()
            if(minutes == 0) minutes = "00"
            let paid = data.paid
            let date = `${day}/${month}/${year} at ${hour}:${minutes}`
            if(unix_time<now){
              pastRes.push(
                <div className = {styles.reservation}><span className = {styles.resDate}>{date}</span></div>
              )
            } else {
              futureRes.push(
                <div className = {styles.reservation}><span className = {styles.resDate}>{date}</span><span className = {paid?styles.paid:styles.unpaid}>{paid?"paid":"not paid yet"}</span></div>
              )
            }
          });
          setPastReservations(pastRes)
          setFutureReservations(futureRes)
        });
      }
    });
  }, []);

  return (
    <>
      <title>Your account</title>
      <PageHeader title="User Panel" />
      <div className={styles.bookingContainer}>
        <div className={styles.bookingColumn}>
          <div className={styles.bookingColumnHeader}>Past reservations</div>
          <div className={styles.bookingColumnData}>
            {pastReservations}
          </div>
        </div>
        <div className={styles.bookingColumn}>
          <div className={styles.bookingColumnHeader}>Future reservations</div>
          <div className={styles.bookingColumnData}>
            {futureReservations}
          </div>
        </div>
      </div>
      <div className={styles.bookedSpecialOffers}>
        <div className={styles.bookedSpecialOffersHeader}>
          Special reservations
        </div>
        <div className={styles.bookedSpecialOffersContainer}>
          {specialReservations}
        </div>
      </div>
    </>
  );
}
