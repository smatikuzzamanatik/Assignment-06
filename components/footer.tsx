import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <Link href="/" className="brand-link" aria-label="FitLog Home">
          <div className="relative size-5 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt=""
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="brand-title text-sm tracking-wider">FITLOG</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
