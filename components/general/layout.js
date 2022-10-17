import Nav from "./nav"
import Footer from "./footer"
export default function layout({ children }) {
  return <>
    <Nav/>
    <main>{children}</main>
    <Footer/>
    </>;
}
