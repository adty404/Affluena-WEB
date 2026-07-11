import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { isDataImageUrl, isHttpUrl } from '../../lib/avatar';

type UserAvatarProps = {
  /** `avatar_url` — a `data:image/...` upload (mobile format) or legacy http(s) URL. */
  src?: string;
  /** Initials/letter shown when there is no usable photo. */
  fallback: string;
  size?: 'default' | 'large' | 'xl';
  className?: string;
};

/**
 * The single profile-photo circle: renders the avatar image when `src` is a
 * usable data:/http(s) URL (falling back to initials if it fails to load),
 * otherwise the initials on the existing `.avatar` ink gradient.
 */
export function UserAvatar({ src, fallback, size = 'default', className }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  // A new photo gets a fresh chance even if the previous URL failed to load.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const usable = Boolean(src) && !failed && (isDataImageUrl(src!) || isHttpUrl(src!));

  return (
    <div className={clsx('avatar', size !== 'default' && size, className)} aria-hidden="true">
      {usable ? <img src={src} alt="" onError={() => setFailed(true)} /> : fallback}
    </div>
  );
}
