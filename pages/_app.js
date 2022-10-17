import "../styles/globals.css";
import Layout from "../components/general/layout";
import AuthUserProvider from "../lib_firebase/authcontext";
import "react-notifications/lib/notifications.css";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

function MyApp({ Component, pageProps }) {

  return (
    <>
      <>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"/>
    <AuthUserProvider>
      <Layout>
          <Component {...pageProps} /></Layout>
          </AuthUserProvider>
    <NotificationContainer />
    </>
    </>
  );
}

export default MyApp;
