import React from 'react'
import { cn } from '~/lib/utils'

interface HeaderProps extends React.ComponentPropsWithRef<'header'> {
  sticky?: boolean
}

export const Header = ({
  className,
  sticky,
  children,
  ref,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={ref}
      className={cn(
        'flex items-start gap-3 bg-background p-4 sm:gap-4',
        sticky && 'sticky top-0 z-20',
        offset > 10 && sticky ? 'shadow' : 'shadow-none',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}
Header.displayName = 'Header'
