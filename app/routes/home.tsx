import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ThemeSwitch } from '~/components/theme-switch'
import { Separator } from '~/components/ui/separator'

export default function Home() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Emo Copy Generator
          </h1>
          <p className="text-muted-foreground">
            Generate emotional copy for your next project.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <Separator className="shadow" />

        <div>hogehoge</div>
      </Main>
    </>
  )
}
