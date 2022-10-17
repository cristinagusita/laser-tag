import styles from "../styles/about.module.css";
import Link from "next/link";
export default function () {
  return (
    <>
      <title>About the game</title>
      <div className={styles.mini_title}>
        <span>About the game</span>
        <Link href="/book">
          <button
            className={`${styles.reserveButton} ${styles.reserveButtonTop}`}
          >
            Book now!
          </button>
        </Link>
      </div>
      <div className={styles.about_container}>
        <div className={styles.about_column}>
          <div className={styles.about_title}>What does Laser Tag mean?</div>
          <div className={styles.about_content}>
            <span>• a high-tech indoor virtual fighting game</span>
            <span>• completely painless</span>
            <span>• extremely engaging and exciting</span>
            <span>• accessible to everyone, from 6 to 60 years old </span>
            <span>
              • it uses a super equipment NEXUS PRO with ultra-bright LEDs in 8
              colors that weighs only 1.8 kg
            </span>
            <span>• For only 10$/hour/person</span>
          </div>
        </div>
        <div className={styles.about_column}>
          <div className={styles.about_title}>How does it work?</div>
          <div className={styles.about_content}>
            <span>• equipment: a vest and a weapon</span>
            <span>• game duration: 20 minutes</span>
            <span>
              • surface: 700 square meters of multilevel arena is at the
              disposal of the "combatants"
            </span>
            <span>
              • the arena has 3 bases on 3 levels, but also 2 mines that shoot
              randomly at the players, thus making the game much more exciting,
              2 energizers, where you can charge your lives and ammunition
            </span>
          </div>
        </div>
      </div>
      <div className={styles.about_sentence}>
        <div className={styles.about_content}>
          The monitoring software on the vest records the activity of the
          players (example: who targeted whom and how many times) and accurately
          issues, at the end of the game, a score sheet in real time, thanks to
          the most advanced radio system in the industry.
        </div>
      </div>
      <div className={styles.reserveButtonBottomContainer}>
        <Link href="/book">
          <button className={styles.reserveButton}>Book now!</button>
        </Link>
      </div>
    </>
  );
}
/*
How does it work?
•	equipment: a vest and a weapon
•	game duration: 20 minutes
•	surface: 700 square meters of multilevel arena is at the disposal of the "combatants"
•	the arena has 3 bases on 3 levels, but also 2 mines that shoot randomly at the players, thus making the game much more exciting, 2 energizers, where you can charge your lives and ammunition
The monitoring software on the vest records the activity of the players (example: who targeted whom and how many times) and accurately issues, at the end of the game, a score sheet in real time, thanks to the most advanced radio system in the industry.
*/
