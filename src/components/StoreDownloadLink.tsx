import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useStoreUrl } from '../hooks/useStoreUrl';

type StoreDownloadLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export default function StoreDownloadLink({
  children,
  href: _href,
  target = '_blank',
  rel = 'noopener noreferrer',
  ...props
}: StoreDownloadLinkProps) {
  const storeUrl = useStoreUrl();

  return (
    <a href={storeUrl} target={target} rel={rel} {...props}>
      {children}
    </a>
  );
}
