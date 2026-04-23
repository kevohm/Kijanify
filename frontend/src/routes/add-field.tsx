import { createFileRoute } from '@tanstack/react-router'
import AddField from '../pages/AddField'

export const Route = createFileRoute('/add-field')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddField/>
}
