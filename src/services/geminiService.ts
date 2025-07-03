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

// Réponses équilibrées - amicales mais professionnelles
export const personalizedResponses = {
  greeting: {
    en: [
      "Hello! How can I help you today?",
      "Hi there! What can I assist you with?",
      "Welcome! What would you like to know about Hakach Transfer?"
    ]
  },
  
  understanding: {
    en: [
      "I understand. Let me help you with that.",
      "Got it! Here's what you need to know.",
      "That's a great question. Here's the answer."
    ]
  },
  
  closing: {
    en: [
      "Is there anything else I can help you with?",
      "Do you have any other questions?",
      "Need help with anything else?"
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



    // Construire un prompt équilibré pour des réponses informatives mais concises
    const prompt = `
You are a helpful Hakach Transfer assistant. Provide informative but concise answers.

Knowledge Base:
${context}

User Question: ${question}

GUIDELINES:
- Give complete, helpful answers (3-5 sentences when needed)
- Use knowledge base information thoroughly
- Be friendly and professional
- Include relevant details without being verbose
- For greetings: respond warmly but briefly
- For unrelated questions: "I specialize in Hakach money transfers. How can I assist you with our services?"

Provide a helpful response:`;

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