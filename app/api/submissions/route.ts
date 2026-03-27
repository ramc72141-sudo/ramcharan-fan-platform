import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, title, description, category, file } = body

    // Validate input
    if (!name || !email || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, save to Supabase
    // const { data, error } = await supabase
    //   .from('fan_creations')
    //   .insert([{
    //     title,
    //     creator: name,
    //     email,
    //     category,
    //     description,
    //     image_url: file,
    //     status: 'pending',
    //     created_at: new Date()
    //   }])

    // if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Submission received and queued for moderation',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from Supabase
    // const { data, error } = await supabase
    //   .from('fan_creations')
    //   .select('*')
    //   .eq('status', 'approved')
    //   .order('created_at', { ascending: false })

    return NextResponse.json({
      submissions: [],
      total: 0,
    })
  } catch (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
