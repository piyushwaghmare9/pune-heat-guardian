import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProjects, addProject } from '@/lib/demo/action-data';
import { DEMO_TOKENS, DEMO_USERS } from '@/lib/demo/auth-data';
import { ClimateActionProject } from '@/types/action';

// Helper to authenticate request
async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const userId = DEMO_TOKENS[token];
  return DEMO_USERS.find(u => u.id === userId) || null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');
  const visibility = searchParams.get('visibility'); // e.g. "public"
  
  let projects = getProjects();
  
  if (region) {
    projects = projects.filter(p => p.regionId === region);
  }
  
  if (visibility === 'public') {
    // Only verified projects are visible to the public
    projects = projects.filter(p => p.status === 'Verified' || p.status === 'Monitoring' || p.status === 'Completed');
  }

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Server-side validation
    if (!data.name || !data.actionType || !data.regionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newProject: ClimateActionProject = {
      id: `proj-${Date.now()}`,
      name: data.name,
      description: data.description || "",
      actionType: data.actionType,
      regionId: data.regionId,
      coordinatorId: user.id,
      organizationId: user.role === 'ORGANIZATION' ? user.id : undefined,
      status: "Draft",
      treesPlanned: data.treesPlanned,
      species: data.species,
      areaSqM: data.areaSqM,
      targetStartDate: data.targetStartDate || new Date().toISOString(),
      targetCompletionDate: data.targetCompletionDate || new Date().toISOString(),
      dataStatus: "demo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: []
    };
    
    const saved = addProject(newProject);
    return NextResponse.json({ project: saved }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }
}
