import PageHeader from "../components/general/pageheader";
import styles from "../styles/photos.module.css";

export default function Photos() {
  return (
    <>
      <title>Photos</title>
      <PageHeader title="Photos" />
      <div className={styles.photoLine}>
        <img src="/picture_page/9.jpg" />
        <img src="/picture_page/4.jpg" />
        <img src="/picture_page/7.jpg" />
      </div>
      <div className={styles.photoLine}>
        <img src="/picture_page/1.jpg" />
        <img src="/picture_page/2.jpg" />
        <img src="/picture_page/3.jpg" />
      </div>
      <div className={styles.photoLine}>
        <img src="/picture_page/5.jpg" />
        <img src="/picture_page/8.jpg" />
        <img src="/picture_page/6.jpg" />
      </div>
    </>
  );
}
