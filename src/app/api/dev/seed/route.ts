import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import KnowledgeItem from '@/lib/models/KnowledgeItem';

const EXAMPLE_DATA = [
    {
        title: "Introduction to Large Language Models",
        type: "note",
        tags: ["ai", "llm", "nlp"],
        content: `Large Language Models (LLMs) are deep learning systems trained on massive text datasets. They learn patterns in language and can generate human-like responses. Popular examples include GPT models, Claude, and Gemini. These models are used for chatbots, summarization, translation, and knowledge assistants. LLMs are built using transformer architectures and improve as they scale in data and compute.`
    },
    {
        title: "What is Retrieval-Augmented Generation (RAG)?",
        type: "link",
        sourceUrl: "https://example.com/rag-explained",
        tags: ["ai", "rag", "search"],
        content: `Retrieval-Augmented Generation (RAG) is an AI architecture that combines document retrieval with language generation. Instead of answering purely from training data, the system retrieves relevant documents from a knowledge base and uses them as context. This makes AI responses more accurate, up-to-date, and grounded in real information. RAG is widely used in enterprise AI assistants and knowledge search systems.`
    },
    {
        title: "Why Knowledge Graphs Improve AI Systems",
        type: "insight",
        tags: ["ai", "graph", "knowledge"],
        content: `Knowledge graphs connect related pieces of information using relationships. Unlike flat note systems, a graph structure shows how ideas are linked. This improves discovery of hidden connections, context awareness, and reasoning. Combining knowledge graphs with large language models creates smarter AI systems that can navigate complex information networks.`
    },
    {
        title: "How AI Summarization Works",
        type: "note",
        tags: ["ai", "summarization", "nlp"],
        content: `AI summarization uses natural language processing models to condense long text into shorter, meaningful summaries. These models identify key points, remove redundant information, and preserve the original meaning. Summarization is useful for knowledge systems because it helps users quickly understand stored information without reading everything in full.`
    },
    {
        title: "Building a Second Brain with AI",
        type: "insight",
        tags: ["productivity", "ai", "knowledge"],
        content: `A Second Brain system helps individuals store, organize, and retrieve knowledge efficiently. When AI is added, the system becomes more powerful by automatically tagging content, generating summaries, and answering questions from stored notes. This transforms static storage into an intelligent thinking assistant.`
    }
];

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId') || 'demo-user';

        const createdItems = [];

        for (const entry of EXAMPLE_DATA) {
            // Generate simple AI summary (Step 3)
            const sentences = entry.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const summary = sentences.length > 2
                ? sentences.slice(0, 2).join('. ') + '...'
                : entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : '');

            // Insert into DB
            const item = await KnowledgeItem.create({
                ...entry,
                userId,
                summary,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            createdItems.push(item);
        }

        return NextResponse.json({
            message: `Successfully seeded ${createdItems.length} items for user: ${userId}`,
            items: createdItems
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
