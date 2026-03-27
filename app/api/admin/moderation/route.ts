import { NextRequest, NextResponse } from 'next/server'

// Simple auth check (replace with proper Supabase auth in production)
function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization')
  return authHeader === `Bearer ${process.env.ADMIN_API_KEY}`
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { id, action } = body

    if (!id || !['approve', 'reject', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // In production, update in Supabase
    // const { data, error } = await supabase
    //   .from('fan_creations')
    //   .update({ status: action === 'approve' ? 'approved' : 'rejected' })
    //   .eq('id', id)

    // if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Submission ${action}ed successfully`,
    })
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: 'Failed to process moderation action' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // In production, fetch from Supabase
    // const { data: pending } = await supabase
    //   .from('fan_creations')
    //   .select('*')
    //   .eq('status', 'pending')

    // const { data: approved } = await supabase
    //   .from('fan_creations')
    //   .select('*')
    //   .eq('status', 'approved')

    // const { data: rejected } = await supabase
    //   .from('fan_creations')
    //   .select('*')
    //   .eq('status', 'rejected')

    return NextResponse.json({
      stats: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
