import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjectById, updateProject } from '@/lib/demo/action-data';
import { DEMO_TOKENS, DEMO_USERS } from '@/lib/demo/auth-data';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const userId = DEMO_TOKENS[token];
  return DEMO_USERS.find(u => u.id === userId) || null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = getProjectById(id);
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  return NextResponse.json({ project });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  const { id } = await params;
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  // Authorization: Only Admin or the Coordinator can update
  if (user.role !== 'ADMIN' && project.coordinatorId !== user.id && project.organizationId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const data = await request.json();
    
    // Mass-assignment protection: restrict what fields can be updated
    const allowedUpdates: any = {};
    if (data.status) {
      // Prevent self-verification
      if ((data.status === 'Verified' || data.status === 'Verification Pending') && user.role !== 'ADMIN') {
        if (data.status === 'Verified') {
          return NextResponse.json({ error: 'Only admins can verify projects.' }, { status: 403 });
        }
      }
      allowedUpdates.status = data.status;
    }
    
    if (data.description !== undefined) allowedUpdates.description = data.description;
    if (data.treesPlanted !== undefined) allowedUpdates.treesPlanted = data.treesPlanted;
    
    const updated = updateProject(id, allowedUpdates);
    return NextResponse.json({ project: updated });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
