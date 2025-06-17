"use client";

import React, { useState, KeyboardEvent } from 'react';
import { geminiService, detectLanguage, SupportedLanguage } from '../services/geminiService';

// Mots-clés pour chaque langue
const keywords = {
  corridor: {
    fr: ['corridor', 'couloir', 'corridors', 'couloirs'],
    en: ['corridor', 'corridors', 'route', 'routes', 'pathway', 'pathways'],
    es: ['corredor', 'corredores', 'ruta', 'rutas', 'pasillo', 'pasillos'],
    de: ['korridor', 'korridore', 'route', 'routen', 'weg', 'wege'],
    ar: ['ممر', 'ممرات', 'طريق', 'طرق', 'مسار', 'مسارات'],
    tr: ['koridor', 'koridorlar', 'yol', 'yollar', 'güzergah', 'güzergahlar']
  },
  order: {
    fr: ['commande', 'commandes', 'order', 'orders'],
    en: ['order', 'orders', 'command', 'commands'],
    es: ['orden', 'ordenes', 'pedido', 'pedidos', 'comando', 'comandos'],
    de: ['bestellung', 'bestellungen', 'auftrag', 'aufträge', 'order'],
    ar: ['طلب', 'طلبات', 'أمر', 'أوامر', 'طلبية', 'طلبيات'],
    tr: ['sipariş', 'siparişler', 'emir', 'emirler', 'talep', 'talepler']
  },
  rates: {
    fr: ['taux', 'rates', 'change', 'taux de change', 'cours'],
    en: ['rates', 'rate', 'exchange', 'exchange rate', 'currency'],
    es: ['tasa', 'tasas', 'tipo', 'cambio', 'tipo de cambio'],
    de: ['kurs', 'kurse', 'wechselkurs', 'wechselkurse', 'rate'],
    ar: ['سعر', 'أسعار', 'صرف', 'سعر الصرف', 'تحويل'],
    tr: ['kur', 'kurlar', 'döviz', 'döviz kuru', 'değişim']
  }
};

// Messages de réponse pour chaque langue
const responseMessages = {
  corridor: {
    fr: {
      title: '📍 **Corridors de transfert disponibles :**',
      footer: '✨ *Cliquez sur "Calculer le montant" pour obtenir un devis personnalisé*',
      linkText: 'Calculer le montant',
      noData: 'Aucun corridor disponible',
      error: '❌ Désolé, je n\'ai pas pu récupérer les informations sur les corridors. Veuillez réessayer plus tard.'
    },
    en: {
      title: '📍 **Available transfer corridors:**',
      footer: '✨ *Click on "Calculate amount" to get a personalized quote*',
      linkText: 'Calculate amount',
      noData: 'No corridors available',
      error: '❌ Sorry, I couldn\'t retrieve corridor information. Please try again later.'
    },
    es: {
      title: '📍 **Corredores de transferencia disponibles:**',
      footer: '✨ *Haz clic en "Calcular cantidad" para obtener una cotización personalizada*',
      linkText: 'Calcular cantidad',
      noData: 'No hay corredores disponibles',
      error: '❌ Lo siento, no pude obtener la información de los corredores. Por favor, inténtalo más tarde.'
    },
    de: {
      title: '📍 **Verfügbare Überweisungskorridore:**',
      footer: '✨ *Klicken Sie auf "Betrag berechnen" für ein personalisiertes Angebot*',
      linkText: 'Betrag berechnen',
      noData: 'Keine Korridore verfügbar',
      error: '❌ Entschuldigung, ich konnte die Korridor-Informationen nicht abrufen. Bitte versuchen Sie es später erneut.'
    },
    ar: {
      title: '📍 **ممرات التحويل المتاحة:**',
      footer: '✨ *انقر على "احسب المبلغ" للحصول على عرض أسعار مخصص*',
      linkText: 'احسب المبلغ',
      noData: 'لا توجد ممرات متاحة',
      error: '❌ عذراً، لم أتمكن من الحصول على معلومات الممرات. يرجى المحاولة مرة أخرى لاحقاً.'
    },
    tr: {
      title: '📍 **Mevcut transfer koridorları:**',
      footer: '✨ *Kişiselleştirilmiş teklif almak için "Tutarı hesapla"ya tıklayın*',
      linkText: 'Tutarı hesapla',
      noData: 'Mevcut koridor yok',
      error: '❌ Üzgünüm, koridor bilgilerini alamadım. Lütfen daha sonra tekrar deneyin.'
    }
  },
  order: {
    fr: {
      title: '📦 **Informations sur les commandes :**',
      commandLabel: '📋 **Commande #',
      noData: 'Aucune commande disponible',
      error: '❌ Désolé, je n\'ai pas pu récupérer les informations sur les commandes. Veuillez réessayer plus tard.'
    },
    en: {
      title: '📦 **Order information:**',
      commandLabel: '📋 **Order #',
      noData: 'No orders available',
      error: '❌ Sorry, I couldn\'t retrieve order information. Please try again later.'
    },
    es: {
      title: '📦 **Información de pedidos:**',
      commandLabel: '📋 **Pedido #',
      noData: 'No hay pedidos disponibles',
      error: '❌ Lo siento, no pude obtener la información de los pedidos. Por favor, inténtalo más tarde.'
    },
    de: {
      title: '📦 **Bestellinformationen:**',
      commandLabel: '📋 **Bestellung #',
      noData: 'Keine Bestellungen verfügbar',
      error: '❌ Entschuldigung, ich konnte die Bestellinformationen nicht abrufen. Bitte versuchen Sie es später erneut.'
    },
    ar: {
      title: '📦 **معلومات الطلبات:**',
      commandLabel: '📋 **طلب رقم ',
      noData: 'لا توجد طلبات متاحة',
      error: '❌ عذراً، لم أتمكن من الحصول على معلومات الطلبات. يرجى المحاولة مرة أخرى لاحقاً.'
    },
    tr: {
      title: '📦 **Sipariş bilgileri:**',
      commandLabel: '📋 **Sipariş #',
      noData: 'Mevcut sipariş yok',
      error: '❌ Üzgünüm, sipariş bilgilerini alamadım. Lütfen daha sonra tekrar deneyin.'
    }
  },
  rates: {
    fr: {
      title: '💱 **Taux de change actuels :**',
      footer: '📊 *Taux mis à jour en temps réel*\n💡 *Utilisez ces taux pour calculer vos transferts*',
      noData: 'Taux non disponibles',
      error: '❌ Désolé, je n\'ai pas pu récupérer les taux de change. Veuillez vérifier votre connexion internet et réessayer.'
    },
    en: {
      title: '💱 **Current exchange rates:**',
      footer: '📊 *Rates updated in real time*\n💡 *Use these rates to calculate your transfers*',
      noData: 'Rates not available',
      error: '❌ Sorry, I couldn\'t retrieve exchange rates. Please check your internet connection and try again.'
    },
    es: {
      title: '💱 **Tipos de cambio actuales:**',
      footer: '📊 *Tasas actualizadas en tiempo real*\n💡 *Usa estas tasas para calcular tus transferencias*',
      noData: 'Tasas no disponibles',
      error: '❌ Lo siento, no pude obtener los tipos de cambio. Por favor, verifica tu conexión a internet e inténtalo de nuevo.'
    },
    de: {
      title: '💱 **Aktuelle Wechselkurse:**',
      footer: '📊 *Kurse werden in Echtzeit aktualisiert*\n💡 *Verwenden Sie diese Kurse zur Berechnung Ihrer Überweisungen*',
      noData: 'Kurse nicht verfügbar',
      error: '❌ Entschuldigung, ich konnte die Wechselkurse nicht abrufen. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.'
    },
    ar: {
      title: '💱 **أسعار الصرف الحالية:**',
      footer: '📊 *الأسعار محدثة في الوقت الفعلي*\n💡 *استخدم هذه الأسعار لحساب تحويلاتك*',
      noData: 'الأسعار غير متوفرة',
      error: '❌ عذراً، لم أتمكن من الحصول على أسعار الصرف. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
    },
    tr: {
      title: '💱 **Güncel döviz kurları:**',
      footer: '📊 *Kurlar gerçek zamanlı olarak güncellenir*\n💡 *Transferlerinizi hesaplamak için bu kurları kullanın*',
      noData: 'Kurlar mevcut değil',
      error: '❌ Üzgünüm, döviz kurlarını alamadım. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
    }
  }
};

interface ChatInputProps {
  onSendMessage: (message: string, botResponse?: string) => void;
  isLoading: boolean;
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

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim();
      setMessage(''); // Vider le champ immédiatement
      
      try {
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
          const response = await geminiService.getRates();
          const messages = responseMessages.rates[detectedLanguage];
          
          if (response.success) {
            let formattedData = '';
            if (Array.isArray(response.data)) {
              // Grouper les taux par devise principale
              const groupedRates = response.data.reduce((acc: any, rate: any) => {
                if (!acc[rate.primary_currency]) {
                  acc[rate.primary_currency] = [];
                }
                acc[rate.primary_currency].push(rate);
                return acc;
              }, {});

              formattedData = Object.entries(groupedRates).map(([primaryCurrency, rates]: [string, any]) => 
                `💰 **${primaryCurrency}**\n${rates.map((rate: any) => 
                  `   → ${rate.secondary_currency}: **${rate.exchange_rate}**`
                ).join('\n')}`
              ).join('\n\n');
            } else {
              formattedData = messages.noData;
            }
            const botResponse = `${messages.title}\n\n${formattedData}\n\n${messages.footer}`;
            onSendMessage(userMessage, botResponse);
          } else {
            onSendMessage(userMessage, messages.error);
          }
        } else {
          // Si le message ne contient pas de mots-clés spécifiques, l'envoyer normalement
          onSendMessage(userMessage);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        // En cas d'erreur de détection de langue, utiliser le français par défaut
        onSendMessage(userMessage);
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
    <div className="relative flex items-center gap-2 bg-black/40 rounded-xl p-1">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrivez votre message..."
        className="flex-1 bg-transparent text-amber-50 placeholder-amber-500/50 resize-none outline-none py-3 px-4 h-[44px] max-h-[44px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(245, 158, 11, 0.2) transparent'
        }}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={`flex items-center justify-center w-[44px] h-[44px] rounded-lg transition-all duration-300 transform
          ${message.trim() && !isLoading 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-105 hover:rotate-3' 
            : 'bg-amber-500/20 cursor-not-allowed'}`}
        style={{
          boxShadow: message.trim() && !isLoading ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none'
        }}
      >
        {isLoading ? (
          <svg className="animate-spin w-5 h-5 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            className={`w-5 h-5 ${message.trim() ? 'text-black' : 'text-amber-500/50'}`}
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