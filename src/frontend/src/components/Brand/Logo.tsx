interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <img
      src="/assets/generated/app-logo.dim_512x512.png"
      alt="RetroPlay Logo"
      className={`${sizeClasses[size]} object-contain`}
    />
  );
}
