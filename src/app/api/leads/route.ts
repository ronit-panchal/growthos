import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/leads - List leads for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search') || '';
    const source = searchParams.get('source') || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
        { title: { contains: search } },
      ];
    }

    if (source) {
      where.source = source;
    }

    if (status) {
      where.status = status;
    }

    // Determine sort order
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'desc' : 'desc'; // default desc for most fields
    const orderBy: Record<string, string> = {};
    orderBy[sortField] = sortOrder;

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, title, source, value, userId } = body;

    if (!name || !email || !userId) {
      return NextResponse.json(
        { error: 'name, email, and userId are required' },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        title: title || null,
        source: source || 'manual',
        value: value ? parseFloat(String(value)) : 0,
        userId,
      },
    });

    // Create an activity record
    await db.activity.create({
      data: {
        type: 'lead_created',
        title: 'New lead captured',
        description: `${name} from ${company || 'Unknown'} was added as a lead`,
        userId,
        leadId: lead.id,
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
