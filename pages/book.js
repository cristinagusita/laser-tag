import PageHeader from "../components/general/pageheader";
import styles from "../styles/book.module.css";

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

import { NotificationManager } from "react-notifications";

export default function Book() {

  let db = getFirestore();
  let auth = getAuth();
  let _user = null;
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        Router.push("/login");
      } else {
        _user = user;
      }
    });

  let [phone, setPhone] = useState(null);
  let [size, setSize] = useState(null);

  let [updateIntervals, setUpdateIntervals] = useState(0);

  let updatePhone = (e) => {
    setPhone(e.target.value);
  };

  let updateSize = (e) => {
    setSize(e.target.value);
  };

  let time_intervals = [];
  let today_unix = [],
    tomorrow_unix = [],
    day3_unix = [];
  let today_avai = [],
    tomorrow_avai = [],
    day3_avai = [];
  let today = new Date();
  today.setSeconds(0);
  today.setMilliseconds(0);
  let tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  let day3 = new Date(tomorrow);
  day3.setDate(day3.getDate() + 1);
  for (let i = 10; i <= 21; i++) {
    let half_hour = "" + i + ":30";
    let next_hour = "" + (i + 1) + ":00";
    time_intervals.push(
      "" + i + ":00" + " - " + half_hour,
      half_hour + " - " + next_hour
    );

    today_avai.push(true, true);
    tomorrow_avai.push(true, true);
    day3_avai.push(true, true);

    today.setHours(i);
    today.setMinutes(0);
    today_unix.push(today.getTime());
    today.setMinutes(30);
    today_unix.push(today.getTime());

    tomorrow.setHours(i);
    tomorrow.setMinutes(0);
    tomorrow_unix.push(tomorrow.getTime());
    tomorrow.setMinutes(30);
    tomorrow_unix.push(tomorrow.getTime());

    day3.setHours(i);
    day3.setMinutes(0);
    day3_unix.push(day3.getTime());
    day3.setMinutes(30);
    day3_unix.push(day3.getTime());
  }

  let book = (interval_index, day_index) => {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let day3 = new Date(tomorrow);
    day3.setDate(day3.getDate() + 1);

    let day = [today, tomorrow, day3][day_index];
    let hour_minute = time_intervals[interval_index];
    let hour = parseInt(hour_minute.split(":")[0]);
    let minute = parseInt(hour_minute.split(":")[1]);
    day.setHours(hour);
    day.setMinutes(minute);
    day.setSeconds(0);
    day.setMilliseconds(0);
    let unix_date = day.getTime();
    if (phone == null || phone == "") {
      NotificationManager.error("Please provide your phone number!");
      return;
    }

    try {
      parseInt(phone);
    } catch {
      NotificationManager.error("Invalid phone number");
      return;
    }

    try {
      parseInt(size);
    } catch {
      NotificationManager.error("Invalid group size");
      return;
    }

    if (size == null || size == "") {
      NotificationManager.error("Please provide the group size");
      return;
    }

    if (parseInt(size) > 35) {
      NotificationManager.error("Group size can't be more than 35");
      return;
    }

    if (parseInt(size) < 2) {
      NotificationManager.error("Group size can't be less than 2");
      return;
    }

    setDoc(doc(db, "bookings", unix_date.toString()), {
      date: unix_date,
      group_size: size,
      phoneNumber: phone,
      uid: _user.uid,
      paid: false,
    })
      .then(() => {
        NotificationManager.info("Succesfully booked!");
        setUpdateIntervals(!updateIntervals);
      })
      .catch((error) => {
        NotificationManager.error("Could not book");
      });
  };

  let bookHelper = (interval_index, day_index) => {
    return () => {
      book(interval_index, day_index);
    };
  };

  let [intervals_jsx_today, setIntervals_jsx_today] = useState([]);
  let [intervals_jsx_tomorrow, setIntervals_jsx_tomorrow] = useState([]);
  let [intervals_jsx_day3, setIntervals_jsx_day3] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "bookings")).then((data) => {
      data.docs.forEach((doc) => {
        let unix = doc.data().date;
        let today_index = today_unix.indexOf(unix);
        let tomorrow_index = tomorrow_unix.indexOf(unix);
        let day3_index = day3_unix.indexOf(unix);

        if (today_index != -1) today_avai[today_index] = false;
        if (tomorrow_index != -1) tomorrow_avai[tomorrow_index] = false;
        if (day3_index != -1) day3_avai[day3_index] = false;
      });

      let ints = [];
      time_intervals.forEach((time_interval, i) => {
        if (today_avai[i]) {
          ints.push(
            <div className={styles.time_interval} onClick={bookHelper(i, 0)}>
              {time_interval}
            </div>
          );
        } else {
          ints.push(
            <div
              className={`${styles.time_interval} ${styles.unavailable_time}`}
            >
              {time_interval}
            </div>
          );
        }
      });
      setIntervals_jsx_today(ints);
      ints = [];
      time_intervals.forEach((time_interval, i) => {
        if (tomorrow_avai[i]) {
          ints.push(
            <div className={styles.time_interval} onClick={bookHelper(i, 1)}>
              {time_interval}
            </div>
          );
        } else {
          ints.push(
            <div
              className={`${styles.time_interval} ${styles.unavailable_time}`}
            >
              {time_interval}
            </div>
          );
        }
      });
      setIntervals_jsx_tomorrow(ints);
      ints = [];
      time_intervals.forEach((time_interval, i) => {
        if (day3_avai[i]) {
          ints.push(
            <div className={styles.time_interval} onClick={bookHelper(i, 2)}>
              {time_interval}
            </div>
          );
        } else {
          ints.push(
            <div
              className={`${styles.time_interval} ${styles.unavailable_time}`}
            >
              {time_interval}
            </div>
          );
        }
      });
      setIntervals_jsx_day3(ints);
    });
  }, [updateIntervals, phone, size, Router.pathname]);

  return (
    <>
      <title>Book a game</title>
      <PageHeader title="Book a game" />
      <div className = {styles.bookingTop}>
      <span className = {styles.explanation}>Only 10$ per person for half an hour of fun! Let us know your phone number and how many friends you'll bring with you, then click one of the available(blue) time intervals!</span>
        <input
          type="number"
          onChange={updatePhone}
          placeholder="Phone number"
        />
        <input type="number" onChange={updateSize} placeholder="Group size" />
      </div>
      <div className={styles.bookingContainer}>
        <div className={styles.bookColumn}>
          <span className={styles.bookColumnHeader}>Today</span>
          <div className={styles.book_intervals}>{intervals_jsx_today}</div>
        </div>
        <div className={styles.bookColumn}>
          <span className={styles.bookColumnHeader}>Tomorrow</span>
          <div className={styles.book_intervals}>{intervals_jsx_tomorrow}</div>
        </div>
        <div className={styles.bookColumn}>
          <span className={styles.bookColumnHeader}>
            The day after tomorrow
          </span>
          <div className={styles.book_intervals}>{intervals_jsx_day3}</div>
        </div>
      </div>
    </>
  );
}
