import PageHeader from "../components/general/pageheader";
import { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "../styles/packets.module.css";
import { NotificationManager } from "react-notifications";

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

export default function Packets() {
  let [packets, setPackets] = useState([]);

  let [phone, setPhone] = useState([]);

  let updatePhone = (event)=>{
    setPhone(event.target.value)
  }

  let reserve = (name) =>{
    console.log(name)
    if(phone == null || phone == ''){
      NotificationManager.error("Please provide your phone number!")
      return
    }
    try{
      parseInt(phone)
    } catch {
      NotificationManager.error("The provided phone number is invalid")
      return
    }
    setDoc(doc(db, "booked_packets", (new Date()).getTime().toString()), {
      uid:_user.uid,
      name:name,
      phone:phone,
    }).then(()=>{
      NotificationManager.info("Packet booked! You will receive a call from us ASAP!")
    }).catch((error)=>{
      alert(error.message)
      NotificationManager.error("Packet could not be booked!")
    })
  }

  let reserveCreateHandler = (name)=>{
    return ()=>{
      reserve(name)
    }
  }

  useEffect(() => {
    getDocs(collection(db, "packets")).then((data) => {
      let packets = [];
      data.docs.forEach((doc) => {
        data = doc.data();

        let packet_html = (
          <div className={styles.packet}>
            <div className={styles.packetLinear}>
              <span className = {styles.packetName}>{doc.id}</span>
              <span className = {styles.packetPrice}>{data.price}($)</span>
              <span className = {styles.packetDuration}>{data.duration} hours of fun</span>
              <span className = {styles.packetGroupSize}>{data.group_size} friends</span>
            </div>
            <div className={styles.packetText}>{data.extra_info}</div>
            <div className = {styles.reserveButton} onClick = {reserveCreateHandler(doc.id)}>Reserve this offer</div>
          </div>
        );
        packets.push(packet_html);
      });
      setPackets(packets);
    });
  }, [phone]);

  return (
    <>
      <title>Special offers</title>
      <PageHeader title="Special Offers" />
      <div className = {styles.packetsTop}>
      <span className = {styles.explanation}>Let us know your phone number and how many friends you'll bring with you, then click one of the available(blue) time intervals!</span>
        <input
          type="number"
          onChange={updatePhone}
          placeholder="Phone number"
        />
      </div>
      <div className={styles.packetContainer}>{packets}</div>
      <div className={styles.cta}><span>For more information, you can reach us at +40744238814</span></div>
    </>
  );
}
