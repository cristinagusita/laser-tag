import PageHeader from "../components/general/pageheader";
import styles from "../styles/cart.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "next/router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

import { NotificationManager } from "react-notifications";
export default function cart() {
  let [pdf_res, set_pdf_res] = useState([]);
  let [unix_to_update, set_unix_to_update] = useState([]);

  let set_to_paid = () => {
    let total = unix_to_update.length
    unix_to_update.forEach((unix_time, i) => {
      let docref = doc(db, "bookings", unix_time.toString());
      let data = {
        paid: true,
      };
      updateDoc(docref, data).then(() => {
        if (i == total - 1) {
          window.location.pathname = window.location.pathname
        }
      });
    });
  };

  let generate_pdf = () => {

    let card_number = paymentInfo["card_number"]
    if(card_number.length != 16){
      NotificationManager.error("Card Number must be 16 digits")
      return;
    }

    try{
      parseInt(card_number)
    } catch{
      NotificationManager.error("Card Number appears to be invalid")
      return
    }

    let owner_name = paymentInfo["owner_name"]
    if(owner_name.length < 2){
      NotificationManager.error("Owner name is too short")
      return
    }

    let exp_date = paymentInfo["exp_date"]
    let cvv = paymentInfo["cvv"]
    window.cv = cvv
    if(cvv.length != 3){
      NotificationManager.error("CVV must be 3 digits")
      return
    }

    try{
      parseInt(cvv)
    } catch {
      NotificationManager.error("CVV does not appear to be valid")
      return
    }

    if(isNaN(parseInt(cvv))){
      NotificationManager.error("CVV should be a 3 digit number")
      return
    }

    if(paymentInfo["exp_date"] == ""){
      NotificationManager.error("Please select the expiration date")
      return
    }

    let pdfdoc = new jsPDF();
    pdfdoc.setFontSize(20);
    let text = "Laser Tag receipt";
    let textX =
      (pdfdoc.internal.pageSize.getWidth() - pdfdoc.getTextWidth(text)) / 2;
    pdfdoc.text(text, textX, 15);
    autoTable(pdfdoc, {
      head: [["Date", "Group size", "Price"]],
      body: pdf_res,
      startY: 25,
    });
    pdfdoc.setFontSize(10);
    pdfdoc.text(
      "Total paid:" + total + "$",
      195,
      pdfdoc.lastAutoTable.finalY + 10,
      {
        align: "right",
      }
    );

    text = "See you again! Don't forget to check out our special offers!";
    textX =
      (pdfdoc.internal.pageSize.getWidth() - pdfdoc.getTextWidth(text)) / 2;
    pdfdoc.text(text, textX, pdfdoc.lastAutoTable.finalY + 20);

    pdfdoc.save("receipt.pdf");
    set_to_paid();
  };

  let loading = true;
  let [upd, setUpd] = useState(true)
  let [unpaid, setUnpaid] = useState([]);
  var dtToday = new Date();

  var month = dtToday.getMonth() + 1;
  var day = dtToday.getDate();
  var year = dtToday.getFullYear();

  if (month < 10)
    month = '0' + month.toString();
  if (day < 10)
    day = '0' + day.toString();

  var maxDate = year + '-' + month + '-' + day;
  let [total, setTotal] = useState(0);
  let [today, setToday] = useState(maxDate);
  let db = getFirestore();
  let auth = getAuth();
  let _user = null;
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        Router.push("/login");
      } else {
        _user = user;
        if (loading) {
          loading = false;
          getDocs(collection(db, "bookings")).then((data) => {
            let unpaid_reservations = [];
            let total_money = 0;
            let pdf_r = [];
            let unixes = [];
            data.docs.forEach((doc) => {
              data = doc.data();
              if (data.paid) return;
              if (data.uid != _user.uid) return;
              let unix_time = data.date;
              let date_obj = new Date(data.date);
              let day = date_obj.getDate();
              let year = date_obj.getFullYear();
              let month = date_obj.getMonth() + 1;
              let hour = date_obj.getHours();
              let minutes = date_obj.getMinutes();
              if (minutes == 0) minutes = "00";
              let paid = data.paid;
              let date = `${day}/${month}/${year} at ${hour}:${minutes}`;
              let expired = unix_time < new Date().getTime();
              if (!expired) {
                pdf_r.push([date, data.group_size, "" + data.group_size * 10]);
                unixes.push(unix_time);
              }
              if (!expired) total_money += 10 * data.group_size;
              unpaid_reservations.push(
                <>
                  {expired && (
                    <div className={styles.resExpired}>
                      <span className={styles.resDate}>{date}</span>
                      <span className={styles.groupSize}>
                        {data.group_size}
                      </span>
                      <span className={styles.price}>
                        {data.group_size * 10}($)
                      </span>
                      <span className={styles.expired_label}>Expired</span>
                    </div>
                  )}
                  {!expired && (
                    <div className={styles.res}>
                      <span className={styles.resDate}>{date}</span>
                      <span className={styles.groupSize}>
                        {data.group_size}
                      </span>
                      <span className={styles.price}>
                        {data.group_size * 10}($)
                      </span>
                      <span className={styles.unpaid_label}>Unpaid</span>
                    </div>
                  )}
                </>
              );
            });
            setUnpaid(unpaid_reservations);
            setTotal(total_money);
            set_pdf_res(pdf_r);
            set_unix_to_update(unixes);
          });
        }
      }
    });
  }, [upd]);

  let [paymentInfo, setPaymentInfo] = useState({
    "card_number": "",
    "owner_name": "",
    "exp_date": "",
    "cvv": "",
  })

  let updatePaymentInfo = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <>
      <PageHeader title="Shopping cart" />
      <title>Shopping cart</title>
      <div className={styles.unpaidContainer}>
        <div className={styles.unpaidHeader}>
          <span>Date booked</span>
          <span>Group size</span>
          <span>Price</span>
          <span>Status</span>
        </div>
        <div className={styles.unpaid}>{unpaid}</div>
      </div>
      <div className={styles.totalUnpaid}>Total:{total}</div>
      <form className={styles.detailsForm} onChange={updatePaymentInfo}>
        <span><label for="card_number">Card number</label><input type="number" name="card_number" placeholder="Card number" /></span>
        <span><label for="owner_name">Card owner name</label><input type="text" name="owner_name" placeholder="Your name" /></span>
        <span><label for="exp_date">Expiration date</label><input type="date" name="exp_date" min={today} placeholder="Expiration date" /></span>
        <span><label for="cvv">CVV</label><input type="text" name="cvv" placeholder="CVV" /></span>
      </form>
      <div className={styles.payAll}>
        {unix_to_update.length > 0 && <span onClick={generate_pdf}>Pay all</span>}
        {(unix_to_update.length == 0) && <span class="grayed">Nothing to pay!</span>}
      </div>
    </>
  );
}
