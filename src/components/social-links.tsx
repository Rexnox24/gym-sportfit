import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { socialLinks } from '@/lib/social-links';

export interface SocialLinksProps extends ComponentPropsWithoutRef<'div'> {
  /** Named layouts for footer icons or labeled mobile navigation. */
  variant?: 'icons' | 'labeled';
}

/** Official Gym Sportfit social destinations, opened without leaving the gym page. */
export const SocialLinks = forwardRef<HTMLDivElement, SocialLinksProps>(
  ({ variant = 'icons', className, ...props }, ref) => (
    <div ref={ref} className={cn('social-links', variant === 'labeled' && 'social-links-labeled', className)} {...props}>
      {socialLinks.map(({ name, href }) => (
        <Button key={name} asChild variant="outline" size={variant === 'icons' ? 'icon' : 'default'} className="social-button">
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} de Gym Sportfit (abre otra pestaña)`} title={name}>
            {name === 'Instagram' ? <Instagram aria-hidden="true" /> : name === 'Facebook' ? <Facebook aria-hidden="true" /> : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.7 1h-4v14.7a3.2 3.2 0 1 1-2.8-3.2V8.4a7.3 7.3 0 1 0 6.8 7.3V8.2a9.6 9.6 0 0 0 5.6 1.8V6a5.6 5.6 0 0 1-5.6-5Z" /></svg>
            )}
            {variant === 'labeled' && name}
          </a>
        </Button>
      ))}
    </div>
  ),
);
SocialLinks.displayName = 'SocialLinks';