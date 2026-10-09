import { Link } from 'react-router-dom'
import { PageFrame } from '../site/PageFrame'

export default function NotFoundPage() {
  return (
    <PageFrame title="This page is unfiled">
      <p className="empty-state">The address does not match a record in the archive.</p>
      <Link className="text-link" to="/">Return to the index</Link>
    </PageFrame>
  )
}
