import Link from "next/link"
export default function(){
    return (
        <footer>
            <div className = "copyright">© 2022 Gusita Cristina Inc. All rights reserved.</div>
            <div className = "footerLinks">
                <Link href="/contact"><a>Contact</a></Link>
            </div>
        </footer>
    )
}