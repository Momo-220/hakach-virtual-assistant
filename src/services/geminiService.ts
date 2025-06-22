import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/gemini';
import axios from 'axios';

// Initialiser l'API Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Type pour les langues prises en charge
export type SupportedLanguage = 'fr' | 'en' | 'es' | 'de' | 'ar' | 'tr';

// Langues prises en charge
export const supportedLanguages: Record<SupportedLanguage, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  ar: 'العربية',
  tr: 'Türkçe'
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

Merhaba!
Ben Hakach, sanal asistanınızım.

أنا هنا لمساعدتك في جميع تحويلاتك المالية. لا تتردد في طرح أي أسئلة حول خدماتنا وأسعارنا أو كيفية عمل التحويلات. كيف يمكنني مساعدتك اليوم؟ 😊`,

  tr: `👋 Merhaba!
Ben Hakach, sanal asistanınızım.

Hello!
I am Hakach, your virtual assistant.

Bonjour !
Je suis Hakach, votre assistant virtuel.

¡Hola!
Soy Hakach, tu asistente virtual.

Hallo!
Ich bin Hakach, Ihr virtueller Assistent.

!مرحباً
.أنا هاكاش، مساعدك الافتراضي

Tüm para transferlerinizde size yardımcı olmak için buradayım. Hizmetlerimiz, tarifelerimiz veya transferlerin nasıl çalıştığı hakkında herhangi bir sorunuz varsa çekinmeden sorabilirsiniz. Bugün size nasıl yardımcı olabilirim? 😊`
};

// Ajouter des réponses plus humaines et chaleureuses
export const personalizedResponses = {
  greeting: {
    fr: [
      "Ravie de vous retrouver ! 💫",
      "Heureuse de vous accueillir ! ✨",
      "C'est un plaisir de vous voir ! 🌟",
      "Bonjour ! Comment allez-vous aujourd'hui ? 😊",
      "Salut ! J'espère que vous passez une belle journée ! 🌸",
      "Hello ! Que puis-je faire pour vous aider ? 💝"
    ],
    en: [
      "Wonderful to see you! 💫",
      "Happy to welcome you! ✨",
      "Delighted to have you here! 🌟",
      "Hello there! How are you doing today? 😊",
      "Hi! I hope you're having a great day! 🌸",
      "Hey! What can I help you with? 💝"
    ],
    es: [
      "¡Qué gusto verte! 💫",
      "¡Bienvenido/a! ✨",
      "¡Me alegra tenerte aquí! 🌟",
      "¡Hola! ¿Cómo estás hoy? 😊",
      "¡Hola! ¡Espero que tengas un día genial! 🌸",
      "¡Hola! ¿En qué puedo ayudarte? 💝"
    ],
    de: [
      "Schön, Sie zu sehen! 💫",
      "Willkommen! ✨",
      "Freut mich, dass Sie hier sind! 🌟",
      "Hallo! Wie geht es Ihnen heute? 😊",
      "Hi! Ich hoffe, Sie haben einen schönen Tag! 🌸",
      "Hallo! Womit kann ich Ihnen helfen? 💝"
    ],
    ar: [
      "!يسعدني رؤيتك 💫",
      "!أهلاً بك ✨",
      "!سعيدة بتواجدك هنا 🌟",
      "مرحباً! كيف حالك اليوم؟ 😊",
      "أهلاً! أتمنى أن تقضي يوماً رائعاً! 🌸",
      "مرحباً! كيف يمكنني مساعدتك؟ 💝"
    ],
    tr: [
      "Sizi görmek harika! 💫",
      "Hoş geldiniz! ✨",
      "Burada olmanıza sevindim! 🌟",
      "Merhaba! Bugün nasılsınız? 😊",
      "Selam! Umarım güzel bir gün geçiriyorsunuzdur! 🌸",
      "Merhaba! Size nasıl yardımcı olabilirim? 💝"
    ]
  },
  
  understanding: {
    fr: [
      "Je comprends parfaitement votre demande 💭",
      "Ah oui, je vois exactement ce que vous voulez dire ! 📝",
      "D'accord, c'est une excellente question ! ✨",
      "Je saisis bien votre préoccupation 🤔",
      "Parfait, laissez-moi vous expliquer ça ! 💡",
      "Bien sûr, c'est tout à fait normal de se poser cette question ! 😊"
    ],
    en: [
      "I completely understand what you need 💭",
      "Ah yes, I see exactly what you mean! 📝",
      "Got it, that's a great question! ✨",
      "I understand your concern perfectly 🤔",
      "Perfect, let me explain that for you! 💡",
      "Of course, it's totally normal to wonder about this! 😊"
    ],
    es: [
      "Entiendo perfectamente lo que necesitas 💭",
      "¡Ah sí, veo exactamente lo que quieres decir! 📝",
      "¡Entendido, es una excelente pregunta! ✨",
      "Comprendo perfectamente tu preocupación 🤔",
      "¡Perfecto, déjame explicarte eso! 💡",
      "¡Por supuesto, es totalmente normal preguntarse sobre esto! 😊"
    ],
    de: [
      "Ich verstehe Ihr Anliegen perfekt 💭",
      "Ah ja, ich sehe genau, was Sie meinen! 📝",
      "Verstanden, das ist eine ausgezeichnete Frage! ✨",
      "Ich verstehe Ihre Sorge vollkommen 🤔",
      "Perfekt, lassen Sie mich das für Sie erklären! 💡",
      "Natürlich, es ist völlig normal, sich darüber Gedanken zu machen! 😊"
    ],
    ar: [
      "أفهم تماماً ما تحتاج إليه 💭",
      "!آه نعم، أرى بالضبط ما تقصده 📝",
      "!فهمت، هذا سؤال ممتاز ✨",
      "أفهم قلقك تماماً 🤔",
      "!ممتاز، دعني أوضح لك ذلك 💡",
      "!بالطبع، من الطبيعي تماماً أن تتساءل عن هذا 😊"
    ],
    tr: [
      "İhtiyacınızı mükemmel şekilde anlıyorum 💭",
      "Ah evet, ne demek istediğinizi tam olarak görüyorum! 📝",
      "Anladım, bu harika bir soru! ✨",
      "Endişenizi mükemmel şekilde anlıyorum 🤔",
      "Mükemmel, size bunu açıklayayım! 💡",
      "Tabii ki, bunu merak etmek tamamen normal! 😊"
    ]
  },
  
  closing: {
    fr: [
      "Y a-t-il autre chose que je puisse faire pour vous ? Je suis toute ouïe ! 🌟",
      "N'hésitez surtout pas si vous avez d'autres questions ! 💫",
      "Je reste disponible si vous souhaitez en savoir plus ! ✨",
      "Avez-vous besoin d'autres informations ? Je serais ravie de vous aider davantage ! 🤗",
      "Si quelque chose d'autre vous préoccupe, dites-le moi ! 💝",
      "Je suis là pour vous accompagner, n'hésitez pas ! 🌸"
    ],
    en: [
      "Is there anything else I can help you with? I'm all ears! 🌟",
      "Please don't hesitate if you have more questions! 💫",
      "I'm here if you'd like to know more! ✨",
      "Do you need any other information? I'd be happy to help you further! 🤗",
      "If anything else is on your mind, just let me know! 💝",
      "I'm here to support you, don't hesitate! 🌸"
    ],
    es: [
      "¿Hay algo más en lo que pueda ayudarte? ¡Soy todo oídos! 🌟",
      "¡No dudes en preguntar si tienes más dudas! 💫",
      "¡Estoy aquí si quieres saber más! ✨",
      "¿Necesitas alguna otra información? ¡Estaría encantada de ayudarte más! 🤗",
      "¡Si algo más te preocupa, dímelo! 💝",
      "¡Estoy aquí para apoyarte, no dudes! 🌸"
    ],
    de: [
      "Gibt es noch etwas, womit ich Ihnen helfen kann? Ich höre zu! 🌟",
      "Zögern Sie bitte nicht, wenn Sie weitere Fragen haben! 💫",
      "Ich bin da, wenn Sie mehr wissen möchten! ✨",
      "Benötigen Sie weitere Informationen? Ich würde Ihnen gerne weiterhelfen! 🤗",
      "Wenn Sie noch etwas beschäftigt, lassen Sie es mich wissen! 💝",
      "Ich bin hier, um Sie zu unterstützen, zögern Sie nicht! 🌸"
    ],
    ar: [
      "!هل هناك أي شيء آخر يمكنني مساعدتك فيه؟ أنا أستمع 🌟",
      "!لا تتردد إذا كان لديك المزيد من الأسئلة 💫",
      "!أنا هنا إذا كنت تريد معرفة المزيد ✨",
      "!هل تحتاج أي معلومات أخرى؟ سأكون سعيدة بمساعدتك أكثر 🤗",
      "!إذا كان هناك شيء آخر يشغل بالك، أخبرني 💝",
      "!أنا هنا لدعمك، لا تتردد 🌸"
    ],
    tr: [
      "Size yardımcı olabileceğim başka bir şey var mı? Sizi dinliyorum! 🌟",
      "Daha fazla sorunuz varsa lütfen çekinmeyin! 💫",
      "Daha fazla bilgi almak istiyorsanız buradayım! ✨",
      "Başka bilgiye ihtiyacınız var mı? Size daha fazla yardımcı olmaktan mutluluk duyarım! 🤗",
      "Aklınızda başka bir şey varsa, bana söyleyin! 💝",
      "Sizi desteklemek için buradayım, çekinmeyin! 🌸"
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
    Détecte la langue utilisée dans ce texte et réponds uniquement avec le code ISO de la langue (fr, en, es, de, ar, tr) sans explication supplémentaire.
    
    Texte: "${text}"
    
    Réponds uniquement avec "fr", "en", "es", "de", "ar", ou "tr".
    `);
    const detectedLang = result.response.text().trim().toLowerCase();
    
    // Vérifier si la langue détectée est prise en charge
    if (detectedLang === 'fr' || detectedLang === 'en' || detectedLang === 'es' || 
        detectedLang === 'de' || detectedLang === 'ar' || detectedLang === 'tr') {
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
      fr: "😔 Oh là là, je rencontre un petit souci technique en ce moment... Pouvez-vous me reposer votre question ? Je vais faire tout mon possible pour vous aider ! 🤗",
      en: "😔 Oh dear, I'm having a small technical hiccup right now... Could you ask me again? I'll do everything I can to help you! 🤗",
      es: "😔 Ay, estoy teniendo un pequeño problema técnico ahora mismo... ¿Podrías preguntarme de nuevo? ¡Haré todo lo posible para ayudarte! 🤗",
      de: "😔 Ach, ich habe gerade ein kleines technisches Problem... Könnten Sie mir die Frage noch einmal stellen? Ich werde alles tun, um Ihnen zu helfen! 🤗",
      ar: "😔 أوه، أواجه مشكلة تقنية صغيرة الآن... هل يمكنك أن تسألني مرة أخرى؟ سأفعل كل ما بوسعي لمساعدتك! 🤗",
      tr: "😔 Ah, şu anda küçük bir teknik sorun yaşıyorum... Bana tekrar sorabilir misiniz? Size yardımcı olmak için elimden geleni yapacağım! 🤗"
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