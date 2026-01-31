/**
 * AI Utility for Knowledge System
 * Proxies calls to the server-side AI processing route to satisfy infrastructure requirements.
 */

export async function summarizeContent(content: string): Promise<string> {
    try {
        const response = await fetch('/api/ai/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, type: 'summarize' })
        });
        const data = await response.json();
        return data.result || "";
    } catch (error) {
        console.error("Server-side AI Summarize Error:", error);
        return "";
    }
}

export async function suggestTags(content: string): Promise<string[]> {
    try {
        const response = await fetch('/api/ai/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, type: 'suggest-tags' })
        });
        const data = await response.json();
        return data.result || [];
    } catch (error) {
        console.error("Server-side AI Tag Suggest Error:", error);
        return [];
    }
}

export async function askPuterAI(prompt: string, model: string = "gpt-5-nano"): Promise<string> {
    if (typeof window === 'undefined') return "";

    try {
        // @ts-ignore
        if (window.puter) {
            // @ts-ignore
            const response = await window.puter.ai.chat(prompt, { model });
            if (response && response.message && response.message.content) {
                return response.message.content;
            }
        }
        return "AI service is processing...";
    } catch (error) {
        console.error("Puter AI Chat Error:", error);
        return "AI service currently unavailable.";
    }
}
