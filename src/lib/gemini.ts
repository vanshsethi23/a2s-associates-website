/**
 * Minimal Gemini REST client.
 *
 * Model ids are read from the environment rather than hardcoded: Google
 * renames and retires them on its own schedule, and a wrong id should be a
 * one-line env change, not a code change. See README "Automated blog".
 */

const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta'
// Verified against the live API on 2026-09-02: gemini-2.5-flash returned 404
// ("no longer available to new users"); these are Google's own current
// generation as of that check. Still env-overridable, since Google will move
// these on again.
export const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-3.6-flash'
export const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image'

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

const apiKey = (): string => {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new GeminiError('GEMINI_API_KEY is not set.')
  return key
}

type Part = { text?: string; inlineData?: { mimeType: string; data: string } }

const callModel = async (model: string, body: unknown): Promise<Part[]> => {
  const res = await fetch(`${API_BASE}/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey() },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new GeminiError(
      `Gemini ${model} returned ${res.status}. ${detail.slice(0, 400)}`,
      res.status,
    )
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: Part[] }; finishReason?: string }[]
    promptFeedback?: { blockReason?: string }
  }

  if (json.promptFeedback?.blockReason) {
    throw new GeminiError(`Gemini blocked the prompt: ${json.promptFeedback.blockReason}`)
  }

  const parts = json.candidates?.[0]?.content?.parts
  if (!parts || parts.length === 0) {
    throw new GeminiError(
      `Gemini ${model} returned no content (finishReason: ${json.candidates?.[0]?.finishReason ?? 'unknown'}).`,
    )
  }
  return parts
}

/** Generates JSON and parses it, tolerating models that wrap it in a code fence. */
export const generateJson = async <T>(prompt: string, schema?: object): Promise<T> => {
  const parts = await callModel(TEXT_MODEL, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.75,
      responseMimeType: 'application/json',
      ...(schema ? { responseSchema: schema } : {}),
    },
  })

  const raw = parts
    .map((p) => p.text || '')
    .join('')
    .trim()
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/, '')
    .trim()

  try {
    return JSON.parse(cleaned) as T
  } catch {
    throw new GeminiError(`Gemini did not return valid JSON. First 300 chars: ${cleaned.slice(0, 300)}`)
  }
}

export type GeneratedImage = { buffer: Buffer; mimeType: string; extension: string }

/** Generates an image and returns the raw bytes, ready to hand to Payload. */
export const generateImage = async (prompt: string): Promise<GeneratedImage> => {
  const parts = await callModel(IMAGE_MODEL, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })

  const image = parts.find((p) => p.inlineData?.data)
  if (!image?.inlineData) {
    throw new GeminiError(
      `Gemini ${IMAGE_MODEL} returned no image. Confirm GEMINI_IMAGE_MODEL is an image-capable model.`,
    )
  }

  const mimeType = image.inlineData.mimeType || 'image/png'
  return {
    buffer: Buffer.from(image.inlineData.data, 'base64'),
    mimeType,
    extension: mimeType.includes('jpeg') ? 'jpg' : mimeType.includes('webp') ? 'webp' : 'png',
  }
}

export const geminiConfigured = (): boolean => Boolean(process.env.GEMINI_API_KEY)
