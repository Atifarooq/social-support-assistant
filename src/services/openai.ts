export interface OpenAIRequest {
  prompt: string;
  fieldType: 'financial_situation' | 'employment_circumstances' | 'reason_for_applying';
}

export interface OpenAISuggestion {
  text: string;
}

export async function generateTextSuggestion(
  request: OpenAIRequest
): Promise<OpenAISuggestion> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const systemPrompts = {
    financial_situation: 'You are helping someone describe their current financial situation for a government assistance application. Write a clear, respectful, and professional description in 2-3 sentences.',
    employment_circumstances: 'You are helping someone describe their employment circumstances for a government assistance application. Write a clear, respectful, and professional description in 2-3 sentences.',
    reason_for_applying: 'You are helping someone explain why they are applying for government financial assistance. Write a clear, respectful, and professional explanation in 2-3 sentences.'
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompts[request.fieldType]
          },
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 429 || error.error?.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing or add a valid API key with available credits.');
      }

      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your VITE_OPENAI_API_KEY in the .env file.');
      }

      throw new Error(error.error?.message || 'Failed to generate suggestion');
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content?.trim() || '';

    if (!text) {
      throw new Error('No suggestion generated');
    }

    return { text };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to OpenAI service');
  }
}
