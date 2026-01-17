import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <div className="h-10 w-10">
        <svg viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-lg">
            <rect width="108" height="108" fill="url(#pcmb_grad)" />
            <text
                x="54"
                y="36"
                textAnchor="middle"
                fill="white"
                fontSize="36"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                letterSpacing="-1"
                style={{ fontWeight: 300 }}
            >
                PCM
            </text>
            <g stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Book */}
                <path d="M 18 92 c 20 -20 52 -20 72 0" />
                <path d="M 14 91 v 8 h 80 v -8" />
                
                {/* Cap */}
                <path d="M 54 48 l 30 14 l -30 14 l -30 -14 z" />
                <path d="M 54 70 l 0 8 l 20 -4 l 0 -8" />

                {/* Tassel */}
                <path d="M 84 62 h 5 v 10"/>
                <path d="M 89 68 h -3"/>
                 <path d="M 89 72 h -3"/>

            </g>
            <defs>
                <linearGradient id="pcmb_grad" x1="0" y1="0" x2="108" y2="108" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B35A6"/>
                    <stop offset="1" stopColor="#D52E88"/>
                </linearGradient>
            </defs>
        </svg>
      </div>
      <span className="text-xl font-headline font-bold text-primary">WPCM</span>
    </Link>
  );
}
