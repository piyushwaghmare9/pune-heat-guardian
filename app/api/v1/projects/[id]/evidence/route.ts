import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addEvidence, getProjectById } from '@/lib/demo/action-data';
import { DEMO_TOKENS, DEMO_USERS } from '@/lib/demo/auth-data';
import { ProjectEvidence } from '@/types/action';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const userId = DEMO_TOKENS[token];
  return DEMO_USERS.find(u => u.id === userId) || null;
}

export async function POST(
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
  
  // Authorization: Only coordinator or admin can submit evidence
  if (user.role !== 'ADMIN' && project.coordinatorId !== user.id && project.organizationId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const data = await request.json();
    
    if (!data.description || !data.type) {
      return NextResponse.json({ error: 'Missing required evidence fields' }, { status: 400 });
    }
    
    const evidence: ProjectEvidence = {
      id: `ev-${Date.now()}`,
      projectId: id,
      submittedBy: user.id,
      type: data.type,
      description: data.description,
      fileUrl: data.fileUrl,
      submittedAt: new Date().toISOString(),
      verificationStatus: 'Pending',
    };
    
    const saved = addEvidence(evidence);
    
    return NextResponse.json({ evidence: saved }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
