'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IconTrash } from './icons'

export default function DeleteRowButton({ endpoint, confirmMessage }: { endpoint: string; confirmMessage: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(confirmMessage)) return
    setDeleting(true)
    await fetch(endpoint, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button className="admin-icon-btn" onClick={handleDelete} disabled={deleting} aria-label="Excluir">
      <IconTrash size={13} />
      {deleting ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}
