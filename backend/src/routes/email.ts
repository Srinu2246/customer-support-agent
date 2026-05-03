import { Router, Request, Response } from 'express';
import { generateText } from '../services/groq.js';
import { SYSTEM_PROMPTS } from '../config/prompts.js';

const router = Router();

interface EmailRequest extends Request {
  body: {
    subject?: string;
    customerMessage?: string;
    tone?: string;
  };
}

// POST /api/email - Generate email draft
router.post('/', async (req: EmailRequest, res: Response) => {
  try {
    const { subject, customerMessage, tone = 'professional' } = req.body;

    if (!subject || !customerMessage) {
      return res.status(400).json({
        error: 'Subject and customerMessage are required',
      });
    }

    const prompt = `Customer's message: "${customerMessage}"
Subject: ${subject}
Tone: ${tone}

Please generate a professional response email that addresses the customer's concern.`;

    const emailDraft = await generateText(SYSTEM_PROMPTS.email_drafter, prompt);

    res.json({
      success: true,
      emailDraft,
      subject,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

export default router;
