import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/coins/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/coins/"!</div>
}
