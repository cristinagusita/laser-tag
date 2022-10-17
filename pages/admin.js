let admin_id = "NKEmNbUcHPQhiRz579M20mCun7q2";
import PageHeader from "../components/general/pageheader";
import React, { useState, useEffect } from "react";
import Router from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "../styles/admin.module.css";
import { NotificationManager } from "react-notifications";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

let db = getFirestore();  
let auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.uid != admin_id) {
      Router.push("/");
    }
  } else {
    Router.push("/");
  }
});

export default function Admin() {
  let [offers, setOffers] = useState([]);
  let [updateOffersTrigger, setUpdateOffersTrigger] = useState(0);

  let deleteOffer = (offer_name) => {
    return () => {
        deleteDoc(doc(db, "packets", offer_name))
          .then(() => {
            NotificationManager.info("Offer deleted");
          })
          .catch((error) => {
            NotificationManager.error("Could not delete offer");
          });
        setUpdateOffersTrigger(!updateOffersTrigger);
    };
  };

  useEffect(() => {
    getDocs(collection(db, "packets")).then((data) => {
      let packets = [];
      data.docs.forEach((doc) => {
        data = doc.data();
        let delete_function = deleteOffer(doc.id);
        let packet_html = (
          <div className={styles.packet}>
            <div className={styles.packetLinear}>
              <span>{doc.id}</span>
              <span>{data.price}($)</span>
              <span>{data.duration}</span>
              <span>{data.group_size}</span>
              <span>
                <i class="fa-solid fa-trash-can" onClick={delete_function}></i>
              </span>
            </div>
            <div className={styles.packetText}>{data.extra_info}</div>
          </div>
        );
        packets.push(packet_html);
      });
      setOffers(packets);
    });
  }, [updateOffersTrigger]);

  let [offerFormData, setOfferFormData] = useState({
    name: "",
    price: 0,
    duration: 0,
    size: 0,
    details: "",
  });

  let updateOfferData = (e) => {
    setOfferFormData({
      ...offerFormData,
      [e.target.name]: e.target.value,
    });
  };

  let addOffer = (e) => {
    e.preventDefault();
    let name = offerFormData.name,
      price = offerFormData.price,
      duration = offerFormData.duration,
      size = offerFormData.size,
      details = offerFormData.details;

    let has_error = false;
    if (name.length < 3 || name.length > 20) {
      NotificationManager.error("Name should have between 3 and 15 characters");
      has_error = true;
    }

    if (price < 10 || price > 1000) {
      NotificationManager.error("Price should be between 10 and 1000$");
      has_error = true;
    }

    if (duration < 0.5 || duration > 47 ) {
      NotificationManager.error(
        "Duration should be between 0.5 hours and 5 hours"
      );
      has_error = true;
    }

    if (size < 1 || size > 30) {
      NotificationManager.error(
        "Group size can't be less than 1 or more than 10"
      );
      has_error = true;
    }

    if (details.length < 5) {
      NotificationManager.error(
        "Details should have between 10 and 150 characters"
      );
      has_error = true;
    }

    if (!has_error) {
      setDoc(doc(db, "packets", name), {
        price: price,
        duration: duration,
        extra_info: details,
        group_size: size,
      })
        .then(() => {
          NotificationManager.info("Offer succesfully added!");
          setUpdateOffersTrigger(!updateOffersTrigger);
        })
        .catch((e) => {
          NotificationManager.error("Error adding offer");
        });
    }
  };

  return (
    <>
      <title>Admin panel</title>
      <PageHeader title="Admin panel" />
      <>
        <div className={styles.offerContainer}>
          <div className={styles.offerHeader}>
            <span>Name</span>
            <span>Price</span>
            <span>Duration</span>
            <span>Group size</span>
            <span>Delete button</span>
          </div>
          {offers}
        </div>
        <div className={styles.packetsForm}>
          <span className={styles.formHeader}>Add an offer</span>
          <form onSubmit={addOffer} onChange={updateOfferData}>
            <span>
              <label>Name:</label>
              <input name="name" type="text" placeholder="Offer name" />
            </span>
            <span>
              <label>Price($):</label>
              <input name="price" type="number" placeholder="Offer price" />
            </span>
            <span>
              <label>Duration(in hours):</label>
              <input
                name="duration"
                type="number"
                step = "0.1"
                placeholder="Offer duration"
              />
            </span>
            <span>
              <label>Maximum group size:</label>
              <input type="number" name="size" placeholder="Group size" />
            </span>
            <span>
              <label>Extra details:</label>
              <textarea name="details" />
            </span>
            <span>
              <button>Submit</button>
            </span>
          </form>
        </div>
      </>
    </>
  );
}
