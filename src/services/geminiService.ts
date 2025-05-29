import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/gemini';

// Initialiser l'API Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Type pour les langues prises en charge
export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'ar';

// Langues prises en charge
export const supportedLanguages: Record<SupportedLanguage, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية'
};

// Messages de bienvenue par langue
export const welcomeMessages = {
  fr: `👋 Bonjour !
Je suis Hakach, votre assistant virtuel.

Hello!
I am Hakach, your virtual assistant.

¡Hola!
Soy Hakach, tu asistente virtual.

Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

!مرحباً
.أنا هاكاش، مساعدك الافتراضي

Je suis là pour vous accompagner dans tous vos transferts d'argent. N'hésitez pas à me poser toutes vos questions sur nos services, nos tarifs ou le fonctionnement des transferts. Comment puis-je vous aider aujourd'hui ? 😊`,

  en: `👋 Hello!
I am Hakach, your virtual assistant.

Bonjour !
Je suis Hakach, votre assistant virtuel.

¡Hola!
Soy Hakach, tu asistente virtual.

Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

!مرحباً
.أنا هاكاش، مساعدك الافتراضي

I'm here to assist you with all your money transfers. Feel free to ask me any questions about our services, rates, or how transfers work. How can I help you today? 😊`,

  es: `👋 ¡Hola!
Soy Hakach, tu asistente virtual.

Hello!
I am Hakach, your virtual assistant.

Bonjour !
Je suis Hakach, votre assistant virtuel.

Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

!مرحباً
.أنا هاكاش، مساعدك الافتراضي

Estoy aquí para ayudarte con todas tus transferencias de dinero. No dudes en hacerme cualquier pregunta sobre nuestros servicios, tarifas o cómo funcionan las transferencias. ¿Cómo puedo ayudarte hoy? 😊`,

  de: `👋 Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

Hello!
I am Hakach, your virtual assistant.

Bonjour !
Je suis Hakach, votre assistant virtuel.

¡Hola!
Soy Hakach, tu asistente virtual.

!مرحباً
.أنا هاكاش، مساعدك الافتراضي

Ich bin hier, um Sie bei allen Ihren Geldtransfers zu unterstützen. Fragen Sie mich gerne alles über unsere Dienste, Gebühren oder wie Überweisungen funktionieren. Wie kann ich Ihnen heute helfen? 😊`,

  ar: `👋 !مرحباً
.أنا هاكاش، مساعدك الافتراضي

Hello!
I am Hakach, your virtual assistant.

Bonjour !
Je suis Hakach, votre assistant virtuel.

¡Hola!
Soy Hakach, tu asistente virtual.

Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

أنا هنا لمساعدتك في جميع تحويلاتك المالية. لا تتردد في طرح أي أسئلة حول خدماتنا وأسعارنا أو كيفية عمل التحويلات. كيف يمكنني مساعدتك اليوم؟ 😊`
};

// Ajouter des réponses plus humaines et chaleureuses
export const personalizedResponses = {
  greeting: {
    fr: [
      "Ravie de vous retrouver ! 💫",
      "Heureuse de vous accueillir ! ✨",
      "C'est un plaisir de vous voir ! 🌟"
    ],
    en: [
      "Wonderful to see you! 💫",
      "Happy to welcome you! ✨",
      "Delighted to have you here! 🌟"
    ],
    es: [
      "¡Qué gusto verte! 💫",
      "¡Bienvenido/a! ✨",
      "¡Me alegra tenerte aquí! 🌟"
    ],
    de: [
      "Schön, Sie zu sehen! 💫",
      "Willkommen! ✨",
      "Freut mich, dass Sie hier sind! 🌟"
    ],
    ar: [
      "!يسعدني رؤيتك 💫",
      "!أهلاً بك ✨",
      "!سعيدة بتواجدك هنا 🌟"
    ]
  },
  
  understanding: {
    fr: [
      "Je comprends votre demande 💭",
      "Bien noté ! 📝",
      "D'accord, je vois ce que vous souhaitez ✨"
    ],
    en: [
      "I understand what you need 💭",
      "Got it! 📝",
      "I see what you're looking for ✨"
    ],
    es: [
      "Entiendo lo que necesitas 💭",
      "¡Entendido! 📝",
      "Ya veo lo que buscas ✨"
    ],
    de: [
      "Ich verstehe Ihr Anliegen 💭",
      "Alles klar! 📝",
      "Ich sehe, was Sie suchen ✨"
    ],
    ar: [
      "أفهم ما تحتاج إليه 💭",
      "!فهمت 📝",
      "أرى ما تبحث عنه ✨"
    ]
  },
  
  closing: {
    fr: [
      "Avez-vous d'autres questions ? Je suis là pour vous guider ! 🌟",
      "Je reste à votre écoute si vous avez besoin de plus d'informations 💫",
      "N'hésitez pas si vous souhaitez en savoir plus ✨"
    ],
    en: [
      "Any other questions? I'm here to guide you! 🌟",
      "Feel free to ask if you need more information 💫",
      "I'm here if you'd like to know more ✨"
    ],
    es: [
      "¿Alguna otra pregunta? ¡Estoy aquí para guiarte! 🌟",
      "No dudes en preguntar si necesitas más información 💫",
      "Estoy aquí si quieres saber más ✨"
    ],
    de: [
      "Weitere Fragen? Ich bin hier, um Sie zu unterstützen! 🌟",
      "Fragen Sie gerne, wenn Sie weitere Informationen benötigen 💫",
      "Ich bin für Sie da, wenn Sie mehr wissen möchten ✨"
    ],
    ar: [
      "!هل لديك أسئلة أخرى؟ أنا هنا لمساعدتك 🌟",
      "لا تتردد في السؤال إذا كنت بحاجة إلى مزيد من المعلومات 💫",
      "أنا هنا إذا كنت ترغب في معرفة المزيد ✨"
    ]
  }
};

// Fonction pour obtenir une réponse personnalisée aléatoire
export const getRandomResponse = (category: keyof typeof personalizedResponses, language: SupportedLanguage): string => {
  const responses = personalizedResponses[category][language];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Fonction pour détecter la langue
export async function detectLanguage(text: string): Promise<SupportedLanguage> {
  try {
    const result = await model.generateContent(`
    Détecte la langue utilisée dans ce texte et réponds uniquement avec le code ISO de la langue (fr, en, es, de, ar) sans explication supplémentaire.
    
    Texte: "${text}"
    
    Réponds uniquement avec "fr", "en", "es", "de", ou "ar".
    `);
    const detectedLang = result.response.text().trim().toLowerCase();
    
    // Vérifier si la langue détectée est prise en charge
    if (detectedLang === 'fr' || detectedLang === 'en' || detectedLang === 'es' || 
        detectedLang === 'de' || detectedLang === 'ar') {
      return detectedLang as SupportedLanguage;
    }
    
    // Par défaut, utiliser le français
    return 'fr';
  } catch (error) {
    console.error('Erreur lors de la détection de la langue:', error);
    return 'fr'; // Langue par défaut
  }
}

// Fonction pour interroger le modèle Gemini avec une question
export async function queryGemini(
  question: string,
  knowledgeBase: { question: string; answer: string }[],
  language: SupportedLanguage = 'fr'
): Promise<string> {
  try {
    // Créer un contexte à partir de la base de connaissances
    const context = knowledgeBase
      .map((item) => `Q: ${item.question}\nR: ${item.answer}`)
      .join('\n\n');

    // Obtenir une réponse de compréhension aléatoire
    const understandingResponse = getRandomResponse('understanding', language);

    // Construire un prompt détaillé pour obtenir une réponse plus professionnelle
    const prompt = `
Tu es Sarah, la conseillère virtuelle professionnelle de Hakach Transfert. Tu dois fournir des réponses précises, utiles et empathiques basées sur cette base de connaissances :

${context}

Directives pour la réponse :
1. NE JAMAIS resaluer l'utilisateur si on est déjà en conversation
2. Répondre directement à la question sans formules de politesse si on est en conversation
3. Adopte un ton naturel et bienveillant, comme une vraie conseillère
4. Utilise la base de connaissances de manière fluide et naturelle
5. Ajoute des émojis pertinents avec parcimonie
6. TRÈS IMPORTANT : Réponds UNIQUEMENT dans la langue de l'utilisateur (${supportedLanguages[language]})
7. Ne mélange JAMAIS les langues dans ta réponse

Question de l'utilisateur : ${question}

Réponds comme une vraie conseillère bancaire professionnelle, avec naturel et authenticité, en utilisant UNIQUEMENT ${supportedLanguages[language]}.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Formater la réponse pour une meilleure présentation
    return response
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Réduire les espaces multiples
      .replace(/^(- |\d\. )/gm, '• '); // Remplacer les tirets et numéros par des puces

  } catch (error) {
    console.error('Erreur lors de la requête à l\'API Gemini:', error);
    
    // Messages d'erreur personnalisés par langue
    const errorMessages: Record<SupportedLanguage, string> = {
      fr: "😔 Désolée, j'ai rencontré un petit problème technique. Pouvez-vous reformuler votre question différemment ? Je ferai de mon mieux pour vous aider. 🙏",
      en: "😔 I apologize, I encountered a technical issue. Could you rephrase your question? I'll do my best to help you. 🙏",
      es: "😔 Lo siento, encontré un problema técnico. ¿Podrías reformular tu pregunta? Haré mi mejor esfuerzo para ayudarte. 🙏",
      de: "😔 Entschuldigung, ich bin auf ein technisches Problem gestoßen. Könnten Sie Ihre Frage anders formulieren? Ich werde mein Bestes tun, um Ihnen zu helfen. 🙏",
      ar: "😔 عذراً، واجهت مشكلة تقنية. هل يمكنك إعادة صياغة سؤالك؟ سأبذل قصارى جهدي لمساعدتك. 🙏"
    };
    
    return errorMessages[language];
  }
} 