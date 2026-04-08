/* eslint-disable @next/next/no-img-element */

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className = "", alt = "" }: LogoProps) {
  return (
    <>
      <img
        src="/logo.png"
        alt={alt}
        className={`dark:hidden ${className}`}
      />
      <img
        src="/logo-white.png"
        alt={alt}
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}
