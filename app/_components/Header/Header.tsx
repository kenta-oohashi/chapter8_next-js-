import style from './Header.module.css';
import Link from "next/link";

export default function Header() {
    return(
      <div className={style["header"]}>
        <Link href="/">Blog</Link>
        <Link href="/contact">お問い合わせ</Link>
      </div>
    )
}