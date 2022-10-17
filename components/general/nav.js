import Link from "next/link";
import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let admin_id = "NKEmNbUcHPQhiRz579M20mCun7q2";

export default function Nav() {
  let [is_admin, set_is_admin] = useState(false);
  let [is_logged_in, set_is_logged_in] = useState(false);
  let [user_data, set_user_data] = useState({
    email: null,
    uuid: null,
  });

  let logout = () => {
    auth.signOut();
  };

  let auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      set_is_logged_in(true);
      set_is_admin(admin_id == user.uid);
      set_user_data({
        email: user.email,
        uuid: user.uuid,
      });
    } else {
      set_is_logged_in(false);
      set_is_admin(false);
    }
  });

  return (
    <>
      {!!is_logged_in && (
        <Link href="/cart">
          <a className="shoppingLink">
            <i class="fa-solid fa-cart-shopping"></i>
          </a>
        </Link>
      )}
      <header>
        <nav className="leftNav">
          <Link href="/">
            <a>Laser Tag</a>
          </Link>
        </nav>
        <nav>
          <Link href="/about">
            <a>About the game</a>
          </Link>
          <Link href="/photos">
            <a>Photos</a>
          </Link>
          <Link href="/book">
            <a>Book a game</a>
          </Link>
          <Link href="/packets">
            <a>Special offers</a>
          </Link>
          {!!is_admin && (
            <Link href="/admin">
              <a>Admin Panel</a>
            </Link>
          )}

          {!!is_logged_in && (
            <>
              <Link href="/user">
                <a>
                  <i class="fa-solid fa-user"></i> Your account{" "}
                </a>
              </Link>
              <Link href="">
                <a onClick={logout}>Logout({user_data.email})</a>
              </Link>
            </>
          )}
          {!is_logged_in && (
            <>
              <Link href="/login">
                <a>Login</a>
              </Link>
              <Link href="/register">
                <a>Create an account</a>
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
}
