import styles from "../styles/contact.module.css"
import PageHeader from "../components/general/pageheader"
export default function Contact(){
    return (
        <>
        <PageHeader title = "Contact"/>
        <div className = {styles.contactContainer}>
        <div className = {styles.contactItem}>
            <span className = {styles.contactLabel}>
                Phone number:
            </span>
            <span className = {styles.contactText}>
                0744238814
            </span>
        </div>
        <div className = {styles.contactItem}>
            <span className = {styles.contactLabel}>
                Address:
            </span>
            <span className = {styles.contactText}>
                Death Star, Hawaii, USA, Earth, Milky Way, Universe
            </span>
        </div>
        <div className = {styles.contactItem}>
            <span className = {styles.contactLabel}>
                Email:
            </span>
            <span className = {styles.contactText}>
                lasertag@gmail.com
            </span>
        </div>
        </div>
        </>
    )
}