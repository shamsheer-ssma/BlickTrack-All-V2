import Link from 'next/link';
import BlickTrackLogo from './BlickTrackLogo';

interface ClickableLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showTagline?: boolean;
  className?: string;
  textClassName?: string;
  taglineClassName?: string;
  href?: string;
}

export default function ClickableLogo({
  size = 'lg',
  showIcon = true,
  showTagline = true,
  className = 'justify-center mb-4',
  textClassName = 'text-3xl',
  taglineClassName = 'text-slate-400',
  href = '/'
}: ClickableLogoProps) {
  return (
    <Link href={href} className="inline-block hover:opacity-80 transition-opacity">
      <BlickTrackLogo 
        size={size}
        showIcon={showIcon}
        showTagline={showTagline}
        className={className}
        textClassName={textClassName}
        taglineClassName={taglineClassName}
      />
    </Link>
  );
}


