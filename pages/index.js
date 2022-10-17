import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Laser Tag</title>
        <meta
          name="description"
          content="Have fun with our friends playing laser tag"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mini_title centered">
        <div className={styles.innerTitle}>
          <span className={styles.homeTitle}>
            <span>Laser Tag</span>
          </span>
          <Link href="/book"><button className={styles.reserveButton}>
            Book now for an amazing experience!
          </button></Link>
        </div>
      </div>
      <div className={styles.useless_container}>
        <span className={styles.useless_text}>
          What do we propose? For 20 minutes, forget everything you thought you
          knew about laser tag and let us convince you what it really means.
        </span>
        <span className={styles.useless_text}>
          More precisely, the
          latest-generation special vest that you will wear during the game is
          equipped with sensors that detect if and how many times you have been
          shot. The weapon is completely painless, so you can come with your
          younger sister, your girlfriend or your mother. Of course, the coolest
          thing is to come with as many people as possible, form teams and start
          the fight.
        </span>
      </div>
      <main>
        <div className={styles.bottomPicture}>
          <img src="/picture_page/1.jpg" />
          <img src="/picture_page/9.jpg" />
        </div>
      </main>
    </>
  );
}
