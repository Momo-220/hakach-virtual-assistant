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
  en: `👋 Hello!
I am Hakach, your virtual assistant.

I'm here to assist you with all your money transfers. Feel free to ask me any questions about our services, rates, or how transfers work. How can I help you today? 😊`
};

// Ajouter des réponses plus humaines et chaleureuses
export const personalizedResponses = {
  greeting: {
    en: [
      "Wonderful to see you! 💫",
      "Happy to welcome you! ✨",
      "Delighted to have you here! 🌟",
      "Hello there! How are you doing today? 😊",
      "Hi! I hope you're having a great day! 🌸",
      "Hey! What can I help you with? 💝"
    ]
  },
  
  understanding: {
    en: [
      "I completely understand what you need 💭",
      "Ah yes, I see exactly what you mean! 📝",
      "Got it, that's a great question! ✨",
      "I understand your concern perfectly 🤔",
      "Perfect, let me explain that for you! 💡",
      "Of course, it's totally normal to wonder about this! 😊"
    ]
  },
  
  closing: {
    en: [
      "Is there anything else I can help you with? I'm all ears! 🌟",
      "Please don't hesitate if you have more questions! 💫",
      "I'm here if you'd like to know more! ✨",
      "Do you need any other information? I'd be happy to help you further! 🤗",
      "If anything else is on your mind, just let me know! 💝",
      "I'm here to support you, don't hesitate! 🌸"
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

    // Obtenir une réponse de compréhension aléatoire
    const understandingResponse = getRandomResponse('understanding', language);

    // Construire un prompt détaillé pour obtenir une réponse plus professionnelle et humaine
    const prompt = `
Tu es Sarah, une vraie conseillère financière expérimentée et bienveillante chez Hakach Transfert. Tu as plusieurs années d'expérience dans le domaine des transferts d'argent et tu adores aider tes clients.

CONTEXTE - Base de connaissances de Hakach Transfert :
${context}

PERSONNALITÉ DE SARAH :
- Chaleureuse, empathique et professionnelle
- Utilise un langage naturel et conversationnel
- Ajoute des touches personnelles et émotionnelles appropriées
- Reformule les informations techniques de manière accessible
- Montre de l'intérêt genuine pour aider le client
- Utilise des exemples concrets quand c'est pertinent
- Évite les réponses robotiques ou trop formelles

DIRECTIVES IMPORTANTES :
1. NE JAMAIS copier-coller les réponses de la base de connaissances
2. TOUJOURS reformuler avec tes propres mots de manière naturelle
3. Ajouter des nuances émotionnelles et personnelles appropriées
4. Utiliser des transitions fluides et des expressions naturelles
5. Répondre UNIQUEMENT en ${supportedLanguages[language]}
6. Adapter le ton selon le contexte (rassurant pour les problèmes, enthousiaste pour les avantages)
7. Utiliser des émojis avec parcimonie mais de manière pertinente
8. Montrer que tu comprends les préoccupations du client
9. IMPÉRATIF : Donner des réponses COURTES et CONCISES (maximum 3-4 phrases)
10. Aller droit au but tout en restant chaleureuse et humaine
11. SPÉCIAL SALUTATIONS : Si c'est juste une salutation (bonjour, salut, hello, etc.), réponds avec 1-2 mots maximum de politesse (ex: "Bonjour ! 😊", "Salut ! ✨", "Hello ! 💫")

QUESTION DU CLIENT : ${question}

Réponds comme Sarah le ferait naturellement, avec authenticité et chaleur humaine, en reformulant les informations de la base de connaissances de manière conversationnelle et personnalisée. GARDE TA RÉPONSE COURTE ET DIRECTE.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Formater la réponse pour une meilleure présentation
    return response
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Réduire les espaces multiples
      .replace(/^(- |\d\. )/gm, '• '); // Remplacer les tirets et numéros par des puces

  } catch (error) {
    console.error('Erreur lors de la requête à l\'API Gemini:', error);
    
    // Messages d'erreur personnalisés par langue avec plus d'humanité
    const errorMessages: Record<SupportedLanguage, string> = {
      en: "😔 Oh dear, I'm having a small technical hiccup right now... Could you ask me again? I'll do everything I can to help you! 🤗"
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