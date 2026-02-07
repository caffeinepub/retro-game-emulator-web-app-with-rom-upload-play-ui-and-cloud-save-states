interface IconProps {
  name: 'library' | 'play' | 'settings' | 'save' | 'upload' | 'help';
  className?: string;
}

const iconPositions: Record<IconProps['name'], number> = {
  library: 0,
  play: 1,
  settings: 2,
  save: 3,
  upload: 4,
  help: 5,
};

export default function Icon({ name, className = '' }: IconProps) {
  const position = iconPositions[name];
  const offsetX = position * 128;

  return (
    <div
      className={`inline-block w-8 h-8 ${className}`}
      style={{
        backgroundImage: 'url(/assets/generated/ui-icons-sprite.dim_768x128.png)',
        backgroundPosition: `-${offsetX}px 0`,
        backgroundSize: '768px 128px',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
