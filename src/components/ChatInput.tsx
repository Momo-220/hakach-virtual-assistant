"use client";

import React, { useState, KeyboardEvent } from 'react';
import { geminiService, detectLanguage, SupportedLanguage, queryGemini } from '../services/geminiService';

// Base de connaissances simple pour les questions générales
const knowledgeBase = [
  {
    question: "What is Hakach?",
    answer: "Hakach is a fast and secure money transfer service that allows you to send money worldwide."
  }
];

// Mappage des pays vers leurs codes de devise
const countryCurrencyMap: Record<string, string> = {
  // English
  'france': 'EUR', 'nigeria': 'NGN', 'cameroon': 'XAF', 'turkey': 'TRY',
  'benin': 'XOF', 'niger': 'XOF', 'togo': 'XOF', 'mali': 'XOF', 'burkina faso': 'XOF',
  'russia': 'RUB', 'united states': 'USD', 'usa': 'USD', 'america': 'USD'
};

// Messages pour les questions de pays
const countryQuestions = {
  en: {
    askOrigin: "💰 **To give you the exact exchange rate**, I need information:\n\n📍 **From which country do you want to send money?**\n\n*Examples: France, Nigeria, Turkey, Cameroon, etc.*",
    askDestination: (origin: string) => `✅ **Origin country:** ${origin}\n\n🎯 **In which country is the recipient?**\n\n*Examples: Nigeria, Cameroon, France, etc.*`,
    invalidCountry: "❌ **Country not recognized.** Please specify a valid country among our supported destinations.",
    rateResult: (origin: string, destination: string, rate: number, primaryCur: string, secondaryCur: string) => 
      `💱 **Exchange rate ${origin} → ${destination}**\n\n💰 **1 ${primaryCur} = ${rate} ${secondaryCur}**\n\n📊 *Real-time updated rates*\n💡 *Use this rate to calculate your transfer*`
  }
};

// Messages de réponse pour les APIs
const responseMessages = {
  corridor: {
    en: {
      title: "🌍 **Available Transfer Corridors**",
      linkText: "Open Link",
      footer: "💡 *Click on the links to access the specific corridors*",
      noData: "No corridor data available at the moment.",
      error: "❌ Unable to retrieve corridor information. Please try again later."
    }
  },
  order: {
    en: {
      title: "📋 **Recent Orders**",
      commandLabel: "**Command #",
      noData: "No order data available at the moment.",
      error: "❌ Unable to retrieve order information. Please try again later."
    }
  },
  rates: {
    en: {
      title: "💱 **Exchange Rates**",
      noData: "No rate data available at the moment.",
      error: "❌ Unable to retrieve rate information. Please try again later."
    }
  }
};

// Mots-clés pour l'anglais uniquement
const keywords = {
  corridor: {
    en: ['corridor', 'corridors', 'route', 'routes', 'pathway', 'pathways']
  },
  order: {
    en: ['order', 'orders', 'command', 'commands']
  },
  rates: {
    en: ['rates', 'rate', 'exchange', 'exchange rate', 'currency']
  }
};

interface ChatInputProps {
  onSendMessage: (message: string, botResponse?: string) => void;
  isLoading: boolean;
}

// État pour gérer le processus de demande de taux
interface RateRequestState {
  isActive: boolean;
  step: 'origin' | 'destination' | null;
  originCountry?: string;
  originCurrency?: string;
  language: SupportedLanguage;
}

// Fonction pour détecter les mots-clés dans le message
const detectKeywords = (message: string, language: SupportedLanguage) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, langKeywords] of Object.entries(keywords)) {
    const keywordList = langKeywords[language] || [];
    if (keywordList.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
      return category as keyof typeof keywords;
    }
  }
  return null;
};

// Fonction pour trouver la devise d'un pays
const findCountryCurrency = (countryName: string): { country: string; currency: string } | null => {
  const normalizedInput = countryName.toLowerCase().trim();
  
  for (const [country, currency] of Object.entries(countryCurrencyMap)) {
    if (country.toLowerCase().includes(normalizedInput) || normalizedInput.includes(country.toLowerCase())) {
      return { country: country, currency: currency };
    }
  }
  return null;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [rateRequest, setRateRequest] = useState<RateRequestState>({
    isActive: false,
    step: null,
    language: 'en'
  });

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim();
      setMessage(''); // Vider le champ immédiatement
      
      try {
        // Si on est dans un processus de demande de taux
        if (rateRequest.isActive) {
          await handleRateRequestFlow(userMessage);
          return;
        }

        // Détecter la langue du message
        const detectedLanguage = await detectLanguage(userMessage);
        
        // Détecter les mots-clés dans la langue appropriée
        const keywordCategory = detectKeywords(userMessage, detectedLanguage);
        
        if (keywordCategory === 'corridor') {
          const response = await geminiService.getCorridorData();
          const messages = responseMessages.corridor[detectedLanguage];
          
          if (response.success) {
            let formattedData = '';
            if (Array.isArray(response.data)) {
              formattedData = response.data.map(corridor => 
                `🌍 **${corridor.from}** → **${corridor.to}**\n   💰 [${messages.linkText}](${corridor.target_link})`
              ).join('\n\n');
            } else {
              formattedData = messages.noData;
            }
            const botResponse = `${messages.title}\n\n${formattedData}\n\n${messages.footer}`;
            onSendMessage(userMessage, botResponse);
          } else {
            onSendMessage(userMessage, messages.error);
          }
        } else if (keywordCategory === 'order') {
          const response = await geminiService.getOrderQuery();
          const messages = responseMessages.order[detectedLanguage];
          
          if (response.success) {
            let formattedData = '';
            if (Array.isArray(response.data)) {
              formattedData = response.data.map((order, index) => 
                `${messages.commandLabel}${index + 1}**\n${Object.entries(order).map(([key, value]) => `   • ${key}: ${value}`).join('\n')}`
              ).join('\n\n');
            } else {
              formattedData = messages.noData;
            }
            const botResponse = `${messages.title}\n\n${formattedData}`;
            onSendMessage(userMessage, botResponse);
          } else {
            onSendMessage(userMessage, messages.error);
          }
        } else if (keywordCategory === 'rates') {
          // Commencer le processus de demande de taux
          setRateRequest({
            isActive: true,
            step: 'origin',
            language: detectedLanguage
          });
          const botResponse = countryQuestions[detectedLanguage].askOrigin;
          onSendMessage(userMessage, botResponse);
        } else {
          // Si le message ne contient pas de mots-clés spécifiques, l'envoyer normalement
          onSendMessage(userMessage);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        // En cas d'erreur de détection de langue, utiliser l'anglais par défaut
        onSendMessage(userMessage);
      }
    }
  };

  // Fonction pour gérer le flux de demande de taux
  const handleRateRequestFlow = async (userMessage: string) => {
    const { step, language, originCountry, originCurrency } = rateRequest;

    if (step === 'origin') {
      // Chercher le pays d'origine
      const countryInfo = findCountryCurrency(userMessage);
      
      if (countryInfo) {
        setRateRequest({
          ...rateRequest,
          step: 'destination',
          originCountry: countryInfo.country,
          originCurrency: countryInfo.currency
        });
        
        const botResponse = countryQuestions[language].askDestination(countryInfo.country);
        onSendMessage(userMessage, botResponse);
      } else {
        const botResponse = countryQuestions[language].invalidCountry;
        onSendMessage(userMessage, botResponse);
      }
    } else if (step === 'destination') {
      // Chercher le pays de destination
      const destCountryInfo = findCountryCurrency(userMessage);
      
      if (destCountryInfo && originCurrency) {
        try {
          // Appeler l'API avec les devises spécifiques
          const ratesResult = await geminiService.getRates(originCurrency, destCountryInfo.currency);
          
          if (ratesResult.success && ratesResult.data && ratesResult.data.exchange_rate) {
            const rate = ratesResult.data.exchange_rate;
            const botResponse = countryQuestions[language].rateResult(
              originCountry || 'Origin country',
              destCountryInfo.country,
              rate,
              originCurrency,
              destCountryInfo.currency
            );
            onSendMessage(userMessage, botResponse);
          } else {
            const messages = responseMessages.rates[language];
            const botResponse = messages.error;
            onSendMessage(userMessage, botResponse);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du taux:', error);
          const messages = responseMessages.rates[language];
          const botResponse = messages.error;
          onSendMessage(userMessage, botResponse);
        }
        
        // Réinitialiser le processus
        setRateRequest({
          isActive: false,
          step: null,
          language: 'en'
        });
      } else {
        const botResponse = countryQuestions[language].invalidCountry;
        onSendMessage(userMessage, botResponse);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center gap-1 sm:gap-2 bg-black/40 rounded-xl p-1">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrivez votre message..."
        className="flex-1 bg-transparent text-amber-50 placeholder-amber-500/50 resize-none outline-none py-2 sm:py-3 px-2 sm:px-4 h-[40px] sm:h-[44px] max-h-[40px] sm:max-h-[44px] text-sm sm:text-base overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(245, 158, 11, 0.2) transparent'
        }}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={`flex items-center justify-center w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-lg transition-all duration-300 transform
          ${message.trim() && !isLoading 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-105 hover:rotate-3' 
            : 'bg-amber-500/20 cursor-not-allowed'}`}
        style={{
          boxShadow: message.trim() && !isLoading ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none'
        }}
      >
        {isLoading ? (
          <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${message.trim() ? 'text-black' : 'text-amber-500/50'}`}
            style={{
              filter: message.trim() ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none'
            }}
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput; 