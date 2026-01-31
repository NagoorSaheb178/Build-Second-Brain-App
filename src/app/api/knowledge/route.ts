import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import KnowledgeItem from '@/lib/models/KnowledgeItem';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId') || 'demo-user'; // Default for demo
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        const accessCriteria = {
            $or: [
                { userId },
                { isPublic: true }
            ]
        };

        let filterCriteria: any = {};
        if (type && type !== 'all') filterCriteria.type = type;
        if (search) {
            filterCriteria.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const query = { $and: [accessCriteria, filterCriteria] };
        const items = await KnowledgeItem.find(query).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        // Add demo userId if not provided
        if (!body.userId) body.userId = 'demo-user';

        const newItem = await KnowledgeItem.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
