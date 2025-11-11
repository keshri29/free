"use client";
import styles from "./style.module.scss";

export default function Index({ setIsHovered }) {
  return (
    <>
      <main className={styles.main} id="about">
        <div className={styles.aboutBody}>
          <div className={styles.aboutContainer}>
            <h3 className="headerText">मेरे बारे में</h3>
            <p
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              जब मैं नई तकनीकों की खोज या प्रोजेक्ट नहीं बना रहा होता हूँ,
              तब आप मुझे टेक ब्लॉग पढ़ते हुए, ओपन सोर्स में योगदान देते हुए,
              या कॉफी के साथ अपनी कोडिंग स्किल्स को निखारते हुए पाएंगे।
            </p>
          </div>
        </div>
      </main>

      <main className={styles.main}>
        <div className={styles.servicesBody}>
          <div className={styles.servicesContainer}>
            <h3 className="headerText">मैं किन तकनीकों के साथ काम करता हूँ</h3>
            <div className={styles.wrapper}>
              <h1 className={styles.services}>
                {[
                  "जावास्क्रिप्ट",
                  "टाइपस्क्रिप्ट",
                  "REST एपीआई",
                  "टेलविंड",
                  "रिएक्टजेएस",
                  "मोंगोडीबी",
                  "एक्सप्रेस",
                  "नेक्स्टजेएस",
                  "नोडजेएस",
                  "मायएसक्यूएल",
                  "रिडक्स",
                  "एचटीएमएल5",
                  "सीएसएस3",
                  "गिट",
                ].map((skill) => (
                  <div key={skill} className={`${styles.line} line`}>
                    <div className="text">{skill}</div>
                  </div>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}