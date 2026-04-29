const axios = require('axios');
const Joi = require('joi');

class AIProxyService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useOllama = process.env.USE_OLLAMA === 'true';
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  /**
   * Validate analysis request
   */
  validateAnalysisRequest(data) {
    const schema = Joi.object({
      text: Joi.string().min(1).max(50000).required(),
      writingContext: Joi.object({
        writingType: Joi.string().allow('').optional(),
        contextText: Joi.string().allow('').optional(),
        fileName: Joi.string().allow('').optional(),
        fileContent: Joi.string().allow('').optional(),
        outputInstructions: Joi.string().allow('').optional()
      }).optional()
    });

    return schema.validate(data);
  }

  /**
   * Build context block for prompts
   */
  buildContextBlock(writingContext = {}) {
    const parts = [];
    if (writingContext.writingType) parts.push(`This is a ${writingContext.writingType}.`);
    if (writingContext.contextText) parts.push(`Reference/Context:\n${writingContext.contextText}`);
    if (writingContext.fileContent) parts.push(`Uploaded file content:\n${writingContext.fileContent}`);
    if (writingContext.outputInstructions) parts.push(`Output instructions: ${writingContext.outputInstructions}`);
    return parts.length ? `\n\nADDITIONAL CONTEXT:\n${parts.join("\n\n")}` : "";
  }

  /**
   * Analyze text using AI
   */
  async analyzeText(text, writingContext = {}) {
    const { error } = this.validateAnalysisRequest({ text, writingContext });
    if (error) {
      throw new Error(`Invalid request: ${error.details[0].message}`);
    }

    const contextBlock = this.buildContextBlock(writingContext);

    const systemPrompt = `You are a professional writing editor. Analyze the following text for grammar, style, and clarity improvements.${contextBlock}

For each issue found, provide:
- category: "grammar", "style", or "clarity"
- message: A clear explanation of the issue and why it should be fixed
- original: The exact problematic text from the original (if applicable)
- replacement: The suggested replacement text (if applicable)

Also provide an overall writing quality score from 0 to 100.

Be thorough but practical. Focus on real improvements, not nitpicking.`;

    const userPrompt = `TEXT TO ANALYZE:
"""
${text}
"""`;

    if (this.useOllama) {
      return await this.analyzeWithOllama(systemPrompt, userPrompt);
    } else {
      return await this.analyzeWithOpenAI(systemPrompt, userPrompt);
    }
  }

  /**
   * Analyze text using OpenAI
   */
  async analyzeWithOpenAI(systemPrompt, userPrompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error(`AI analysis failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Analyze text using Ollama
   */
  async analyzeWithOllama(systemPrompt, userPrompt) {
    try {
      const response = await axios.post(`${this.ollamaBaseUrl}/api/chat`, {
        model: this.ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false
      });

      const content = response.data.message?.content;
      if (!content) {
        throw new Error('No response content from Ollama');
      }

      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Ollama API error:', error.response?.data || error.message);
      throw new Error(`AI analysis failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Generate tone variations
   */
  async generateTones(text, writingContext = {}) {
    const { error } = this.validateAnalysisRequest({ text, writingContext });
    if (error) {
      throw new Error(`Invalid request: ${error.details[0].message}`);
    }

    const contextBlock = this.buildContextBlock(writingContext);

    const systemPrompt = `You are an expert writing coach. Rewrite the following text in 4 different tones while keeping the same core message.${contextBlock}

Provide 4 tone variations: Professional, Casual, Enthusiastic, Empathetic.`;

    const userPrompt = `ORIGINAL TEXT:
"""
${text}
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

    if (this.useOllama) {
      return await this.generateTonesWithOllama(systemPrompt, userPrompt);
    } else {
      return await this.generateTonesWithOpenAI(systemPrompt, userPrompt);
    }
  }

  /**
   * Generate tones with OpenAI
   */
  async generateTonesWithOpenAI(systemPrompt, userPrompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      throw new Error(`Tone generation failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate tones with Ollama
   */
  async generateTonesWithOllama(systemPrompt, userPrompt) {
    try {
      const response = await axios.post(`${this.ollamaBaseUrl}/api/chat`, {
        model: this.ollamaModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false
      });

      const content = response.data.message?.content;
      if (!content) {
        throw new Error('No response content from Ollama');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('Ollama API error:', error.response?.data || error.message);
      throw new Error(`Tone generation failed: ${error.response?.data?.error || error.message}`);
    }
  }
}

module.exports = new AIProxyService();