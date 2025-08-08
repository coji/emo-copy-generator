import { LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router'
import { Header } from '~/components/layout/header'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import { HStack } from '~/components/ui/stack'

export const AppHeader = ({ ...rest }: React.ComponentProps<'header'>) => {
  return (
    <Header {...rest}>
      <HStack>
        <h1 className="flex-1 text-2xl font-bold">Emo Copy Generator</h1>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/lp/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              LP管理
            </Link>
          </Button>

          <ThemeSwitch />
        </div>
      </HStack>
      <p className="text-muted-foreground">
        Generate emotional copy for your next project.
      </p>
    </Header>
  )
}
