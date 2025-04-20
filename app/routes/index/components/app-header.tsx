import { ChevronDownIcon } from 'lucide-react'
import { Header } from '~/components/layout/header'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { HStack } from '~/components/ui/stack'
import examples from '~/data/example.json'

interface AppHeaderProps extends React.ComponentProps<'header'> {
  onSelectExample(example: (typeof examples)[0]): void
}
export const AppHeader = ({ onSelectExample, ...rest }: AppHeaderProps) => {
  return (
    <Header {...rest}>
      <HStack>
        <h1 className="flex-1 text-2xl font-bold">Emo Copy Generator</h1>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                サンプル入力
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {examples.map((ex) => {
                return (
                  <DropdownMenuItem
                    key={`${ex.productName}_${ex.productCategory}`}
                    onClick={() => {
                      onSelectExample({ ...ex })
                    }}
                    className="text-xs"
                  >
                    {ex.productName} - {ex.productCategory}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeSwitch />
        </div>
      </HStack>
      <p className="text-muted-foreground">
        Generate emotional copy for your next project.
      </p>
    </Header>
  )
}
