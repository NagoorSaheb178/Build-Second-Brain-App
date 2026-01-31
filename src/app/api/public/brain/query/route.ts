import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import KnowledgeItem from '@/lib/models/KnowledgeItem';
import { askPuterAI } from '@/lib/puter-ai';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const queryStr = searchParams.get('query') || searchParams.get('q');
        const userId = searchParams.get('userId');

        if (!queryStr) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
        }

        // 1️⃣ Access Control (User notes + Public notes)
        const accessCriteria = userId
            ? { $or: [{ userId }, { isPublic: true }] }
            : { isPublic: true };

        // 2️⃣ Primary Search (full query match)
        let sources = await KnowledgeItem.find({
            $and: [
                accessCriteria,
                {
                    $or: [
                        { title: { $regex: queryStr, $options: 'i' } },
                        { content: { $regex: queryStr, $options: 'i' } },
                        { tags: { $in: [new RegExp(queryStr, 'i')] } }
                    ]
                }
            ]
        }).limit(3);

        // 3️⃣ Fallback Keyword Search (if nothing found)
        if (sources.length === 0) {
            const words = queryStr.split(' ').filter(w => w.length > 2);

            if (words.length > 0) {
                sources = await KnowledgeItem.find({
                    $and: [
                        accessCriteria,
                        {
                            $or: words.map(word => ({
                                content: { $regex: word, $options: 'i' }
                            }))
                        }
                    ]
                }).limit(3);
            }
        }

        // Synthesize an answer based on the retrieved sources (Simulated GPT Context)
        let answer = "";
        if (sources.length > 0) {
            const combinedContent = sources.slice(0, 1).map(s => s.summary || s.content.split('.')[0] + '.').join(' ');
            const sourcesList = sources.slice(0, 2).map(s => `• ${s.title}`).join('\n');

            answer = `🧠 AI Answer:\n${combinedContent} This concept is a key part of your knowledge base, helping you organize complex ideas efficiently. By connecting these insights, you can navigate your information network with greater clarity.\n\n📚 Sources:\n${sourcesList}`;
        } else {
            answer = `🧠 AI Answer:\nI couldn’t find matching notes in the brain for "${queryStr}". However, you can add new insights to capture this topic for the future!`;
        }
        return NextResponse.json({
            answer,
            sources: sources.map(s => ({
                title: s.title,
                content: s.summary || s.content,
                type: s.type,
                tags: s.tags
            }))
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
