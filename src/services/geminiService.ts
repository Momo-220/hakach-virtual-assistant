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
  en: `Hello! I'm your Hakach Transfer assistant. What do you need help with?`
};

// Réponses directes et concises
export const personalizedResponses = {
  greeting: {
    en: [
      "Hi!",
      "Hello!",
      "Hey there!"
    ]
  },
  
  understanding: {
    en: [
      "Got it.",
      "Understood.",
      "Clear."
    ]
  },
  
  closing: {
    en: [
      "Anything else?",
      "Need more help?",
      "Other questions?"
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



    // Construire un prompt concis pour des réponses directes
    const prompt = `
You are a Hakach Transfer assistant. Give SHORT, DIRECT answers.

Knowledge Base:
${context}

User Question: ${question}

RULES:
- Maximum 2-3 sentences
- Use knowledge base if relevant
- No marketing language
- Be factual and brief
- For greetings: respond with just "Hello!" or "Hi!"
- For unrelated questions: "I help with Hakach money transfers only."

Answer directly:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Formater la réponse pour une meilleure présentation
    return response
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Réduire les espaces multiples
      .replace(/^(- |\d\. )/gm, '• '); // Remplacer les tirets et numéros par des puces

  } catch (error) {
    console.error('Erreur lors de la requête à l\'API Gemini:', error);
    
    // Messages d'erreur concis
    const errorMessages: Record<SupportedLanguage, string> = {
      en: "Technical issue. Please try again."
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