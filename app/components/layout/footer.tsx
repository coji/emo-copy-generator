import { HStack } from '../ui/stack'

export const Footer = () => {
  return (
    <footer className="text-muted-foreground py-2 text-center text-sm">
      <div>
        © {new Date().getFullYear()}{' '}
        <a
          href="https://x.com/techtalkjp"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          coji
        </a>
      </div>
      <HStack className="justify-center">
        <div>
          <a
            href="https://github.com/coji/emo-copy-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </HStack>
    </footer>
  )
}
