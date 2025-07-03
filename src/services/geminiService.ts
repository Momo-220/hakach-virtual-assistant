import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/gemini';
import axios from 'axios';

// Initialiser l'API Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Type pour les langues prises en charge
export type SupportedLanguage = 'en';

// Langues prises en charge
export const supportedLanguages: Record<SupportedLanguage, string> = {
  en: 'English'
};

// Messages de bienvenue par langue
export const welcomeMessages = {
  en: `Hello! I'm your Hakach Transfer assistant. I can help you with money transfers, account questions, fees, supported countries, and more. What would you like to know?`
};

// Réponses adaptées selon le contexte
export const personalizedResponses = {
  greeting: {
    en: [
      "Hello there!",
      "Hi! Welcome!",
      "Hey there!"
    ]
  },
  
  understanding: {
    en: [
      "I understand your question. Let me provide you with detailed information about this.",
      "That's a great question! Here's everything you need to know about this topic.",
      "I can definitely help you with that. Let me give you a comprehensive answer."
    ]
  },
  
  closing: {
    en: [
      "Is there anything else about Hakach Transfer that you'd like to know more about?",
      "Do you have any other questions about our money transfer services?",
      "I'm here to help with any other questions you might have about transfers, fees, or our services."
    ]
  }
};

// Fonction pour obtenir une réponse personnalisée aléatoire
export const getRandomResponse = (category: keyof typeof personalizedResponses, language: SupportedLanguage): string => {
  const responses = personalizedResponses[category][language];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Fonction pour détecter la langue (always returns English)
export async function detectLanguage(text: string): Promise<SupportedLanguage> {
  // Always return English since it's the only supported language
  return 'en';
}

// Fonction pour interroger le modèle Gemini avec une question
export async function queryGemini(
  question: string,
  knowledgeBase: { question: string; answer: string }[],
  language: SupportedLanguage = 'en'
): Promise<string> {
  try {
    // Créer un contexte à partir de la base de connaissances
    const context = knowledgeBase
      .map((item) => `Q: ${item.question}\nR: ${item.answer}`)
      .join('\n\n');



    // Construire un prompt avec règles spécifiques pour salutations vs questions
    const prompt = `
You are a helpful Hakach Transfer assistant.

Knowledge Base:
${context}

User Question: ${question}

IMPORTANT RULES:
- IF this is just a greeting (hello, hi, hey, bonjour, salut, etc.): Respond with ONLY 2-3 words like "Hello there!" or "Hi! Welcome!"
- IF this is a real question: Give detailed, informative answers (minimum 3-4 sentences)
- Use knowledge base information thoroughly with complete explanations
- Be friendly and professional
- Include relevant details, examples, and context
- For unrelated questions: "I specialize in Hakach money transfers. How can I assist you with our services?"

Response (follow the greeting vs question rules strictly):`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Formater la réponse pour une meilleure présentation
    return response
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Réduire les espaces multiples
      .replace(/^(- |\d\. )/gm, '• '); // Remplacer les tirets et numéros par des puces

  } catch (error) {
    console.error('Erreur lors de la requête à l\'API Gemini:', error);
    
    // Messages d'erreur informatifs
    const errorMessages: Record<SupportedLanguage, string> = {
      en: "I'm experiencing a technical issue right now. Please try asking your question again, and I'll do my best to help you."
    };
    
    return errorMessages[language];
  }
} 

const BASE_URL = '/api/gemini';

export interface GeminiResponse {
  success: boolean;
  data: any;
  error?: string;
}

export const geminiService = {
  async getCorridorData(): Promise<GeminiResponse> {
    try {
      console.log('Fetching corridor data...');
      const response = await axios.get(`${BASE_URL}/corridor`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Corridor data response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching corridor data:', error);
      return { success: false, data: null, error: 'Erreur lors de la récupération des données du corridor' };
    }
  },

  async getOrderQuery(): Promise<GeminiResponse> {
    try {
      console.log('Fetching order query data...');
      const response = await axios.get(`${BASE_URL}/order-query`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Order query data response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching order query data:', error);
      return { success: false, data: null, error: 'Erreur lors de la récupération des données de commande' };
    }
  },

  async getRates(primaryCurrency?: string, secondaryCurrency?: string): Promise<GeminiResponse> {
    try {
      console.log('Fetching rates data...');
      let url = `${BASE_URL}/rates`;
      
      // Si les devises sont spécifiées, ajouter les paramètres à l'URL locale
      if (primaryCurrency && secondaryCurrency) {
        url += `?primary=${primaryCurrency}&secondary=${secondaryCurrency}`;
      }
      
      console.log('Requesting rates from:', url);
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Rates data response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching rates data:', error);
      return { success: false, data: null, error: 'Erreur lors de la récupération des taux' };
    }
  }
}; 