import { analyzeTextSchema, generateSchema } from './validation';
import { logger } from './logger';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Build context block from writing context
 * @param {Object} writingContext - The writing context object
 * @returns {string} - Formatted context block for prompts
 */
export const buildContextBlock = (writingContext) => {
  const parts = [];
  if (writingContext.writingType) parts.push(`This is a ${writingContext.writingType}.`);
  if (writingContext.contextText) parts.push(`Reference/Context:\n${writingContext.contextText}`);
  if (writingContext.fileContent) parts.push(`Uploaded file content:\n${writingContext.fileContent}`);
  if (writingContext.outputInstructions) parts.push(`Output instructions: ${writingContext.outputInstructions}`);
  return parts.length ? `\n\nADDITIONAL CONTEXT:\n${parts.join("\n\n")}` : "";
};

/**
 * Analyze text for writing improvements using OpenAI via fetch
 * @param {string} text - The text to analyze
 * @param {Object} writingContext - Optional writing context object
 * @returns {Promise<{score: number, suggestions: Array}>}
 */
export const analyzeText = async (text, writingContext = {}) => {
  // Validate inputs
  const validatedData = analyzeTextSchema.parse({ text, writingContext });
  const contextBlock = buildContextBlock(validatedData.writingContext);

  const systemPrompt = `You are a professional writing editor. Analyze the following text for grammar, style, and clarity improvements. Return detailed, actionable suggestions.${contextBlock}

For each issue found, provide:
- category: "grammar", "style", or "clarity"
- message: A clear explanation of the issue and why it should be fixed
- original: The exact problematic text from the original (if applicable)
- replacement: The suggested replacement text (if applicable)

Also provide an overall writing quality score from 0 to 100.

Be thorough but practical. Focus on real improvements, not nitpicking.`;

  const userPrompt = `TEXT TO ANALYZE:
"""
${validatedData.text}
"""`;

  // Check which AI provider to use
  const useOllama = import.meta.env.VITE_USE_OLLAMA === 'true';

  if (useOllama) {
    return analyzeWithOllama(validatedData.text, systemPrompt);
  }

  // Default: Use OpenAI via fetch
  return analyzeWithOpenAI(validatedData.text, systemPrompt, userPrompt);
};

/**
 * Analyze text using OpenAI API via fetch
 */
const analyzeWithOpenAI = async (text, systemPrompt, userPrompt) => {
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4.1-mini';
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nReturn your response as JSON with this exact structure:
{
  "score": number (0-100),
  "suggestions": [
    {
      "category": "grammar|style|clarity",
      "message": "explanation",
      "original": "problematic text or null",
      "replacement": "fixed text or null"
    }
  ]
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        input: fullPrompt,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    const content = data.output?.content?.[0]?.text;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    // If no JSON found, try parsing the whole content
    return JSON.parse(content);
  } catch (error) {
    logger.error('Error analyzing text with OpenAI', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
};

/**
 * Analyze text using Ollama (local LLM)
 * @param {string} text - The text to analyze
 * @param {string} systemPrompt - The system prompt
 * @returns {Promise<{score: number, suggestions: Array}>}
 */
const analyzeWithOllama = async (text, systemPrompt) => {
  const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2';

  const userPrompt = `TEXT TO ANALYZE:
"""
${text}
"""

Return your response as JSON with this exact structure:
{
  "score": number (0-100),
  "suggestions": [
    {
      "category": "grammar|style|clarity",
      "message": "explanation",
      "original": "problematic text or null",
      "replacement": "fixed text or null"
    }
  ]
}`;

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.message?.content;

    if (!content) {
      throw new Error('No response content from Ollama');
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    // If no JSON found, try parsing the whole content
    return JSON.parse(content);
  } catch (error) {
    logger.error('Error analyzing text with Ollama', error);
    throw new Error('Failed to analyze text with Ollama. Please check your Ollama server is running.');
  }
};

/**
 * Generate full reply versions based on context
 * @param {string} text - The user's text (can be empty for generating from scratch)
 * @param {Object} writingContext - The writing context object
 * @returns {Promise<{replies: Array}>}
 */
export const generateReplies = async (text, writingContext = {}) => {
  // Validate inputs
  const validatedData = generateSchema.parse({ text, writingContext });
  const contextBlock = buildContextBlock(validatedData.writingContext);
  const hasUserText = validatedData.text ? validatedData.text.trim().length > 0 : false;

  const systemPrompt = hasUserText
    ? `You are an expert writing coach. The user has written a rough draft. Refactor and improve it into 4 distinct ready-to-send versions, each matching the desired tone/style described in the context.${contextBlock}

Generate 4 improved versions with tones: Formal, Friendly, Confident, Concise. Keep the core message but match the desired tone perfectly.`
    : `You are an expert writing coach. The user has NOT written any text yet. Generate 4 complete, ready-to-send replies from scratch based purely on the context and desired tone/style.${contextBlock}

Generate 4 distinct full reply versions with tones: Formal, Friendly, Confident, Concise. Make each one complete and ready to use.`;

  const userPrompt = hasUserText
    ? `USER'S ROUGH TEXT:
"""
${validatedData.text}
"""`
    : `Create 4 distinct reply versions based on the context provided above.`;

  const useOllama = import.meta.env.VITE_USE_OLLAMA === 'true';

  if (useOllama) {
    return generateRepliesWithOllama(validatedData.text, systemPrompt);
  }

  return generateRepliesWithOpenAI(validatedData.text, systemPrompt, userPrompt);
};

/**
 * Generate replies using OpenAI API
 */
const generateRepliesWithOpenAI = async (text, systemPrompt, userPrompt) => {
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4.1-mini';
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}\n\nReturn your response as JSON with this exact structure:
{
  "replies": [
    {
      "tone": "tone name",
      "text": "the full reply text"
    }
  ]
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        input: fullPrompt,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    const content = data.output?.content?.[0]?.text;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    return JSON.parse(content);
  } catch (error) {
    logger.error('Error generating replies with OpenAI', error);
    throw new Error('Failed to generate replies. Please try again.');
  }
};

/**
 * Generate replies using Ollama
 */
const generateRepliesWithOllama = async (text, systemPrompt) => {
  const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2';

  const userPrompt = `Return your response as JSON with this exact structure:
{
  "replies": [
    {
      "tone": "tone name",
      "text": "the full reply text"
    }
  ]
}`;

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.message?.content;

    if (!content) {
      throw new Error('No response content from Ollama');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    return JSON.parse(content);
  } catch (error) {
    logger.error('Error generating replies with Ollama', error);
    throw new Error('Failed to generate replies with Ollama. Please check your Ollama server is running.');
  }
};

/**
 * Generate tone variations for existing text
 * @param {string} text - The text to rewrite
 * @param {Object} writingContext - The writing context object
 * @returns {Promise<{replies: Array}>}
 */
export const generateTones = async (text, writingContext = {}) => {
  // Validate inputs
  const validatedData = generateSchema.parse({ text, writingContext });
  const contextBlock = buildContextBlock(validatedData.writingContext);

  const systemPrompt = `You are an expert writing coach. Rewrite the following text in 4 different tones while keeping the same core message.${contextBlock}

Provide 4 tone variations: Professional, Casual, Enthusiastic, Empathetic.`;

  const userPrompt = `ORIGINAL TEXT:
"""
${validatedData.text}
"""

Return your response as JSON with this exact structure:
{
  "replies": [
    {
      "tone": "tone name",
      "text": "the rewritten text"
    }
  ]
}`;

  const useOllama = import.meta.env.VITE_USE_OLLAMA === 'true';

  if (useOllama) {
    return generateTonesWithOllama(validatedData.text, systemPrompt);
  }

  return generateTonesWithOpenAI(validatedData.text, systemPrompt, userPrompt);
};

/**
 * Generate tone variations using OpenAI
 */
const generateTonesWithOpenAI = async (text, systemPrompt, userPrompt) => {
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4.1-mini';
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        input: fullPrompt,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    const content = data.output?.content?.[0]?.text;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    return JSON.parse(content);
  } catch (error) {
    logger.error('Error generating tones with OpenAI', error);
    throw new Error('Failed to generate tone variations. Please try again.');
  }
};

/**
 * Generate tone variations using Ollama
 */
const generateTonesWithOllama = async (text, systemPrompt) => {
  const ollamaBaseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2';

  const userPrompt = `Return your response as JSON with this exact structure:
{
  "replies": [
    {
      "tone": "tone name",
      "text": "the rewritten text"
    }
  ]
}`;

  try {
    const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.message?.content;

    if (!content) {
      throw new Error('No response content from Ollama');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result;
    }

    return JSON.parse(content);
  } catch (error) {
    logger.error('Error generating tones with Ollama', error);
    throw new Error('Failed to generate tone variations with Ollama. Please check your Ollama server is running.');
  }
};