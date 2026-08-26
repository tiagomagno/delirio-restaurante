import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import UserManager from '@/components/admin/UserManager'

export default async function AdminUsuarios() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true },
  })

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 4 }}>Usuários</h1>
        <p className="admin-lede" style={{ marginBottom: 0 }}>
          Contas com acesso ao painel admin. Todos os usuários têm a mesma permissão.
        </p>
      </div>

      <UserManager
        users={users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        currentUserId={session.sub}
      />
    </div>
  )
}
