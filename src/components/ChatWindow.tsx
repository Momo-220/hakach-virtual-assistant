"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { queryGemini, detectLanguage, welcomeMessages, SupportedLanguage, getRandomResponse } from '../services/geminiService';
import { loadKnowledgeBase, KnowledgeItem } from '../services/knowledgeBaseService';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatWindow: React.FC = () => {
  // Utiliser useRef pour stocker l'état de montage
  const hasMounted = useRef(false);
  
  // États initialisés avec des valeurs par défaut
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('fr');
  const [isInConversation, setIsInConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Effet pour marquer le montage côté client
  useEffect(() => {
    setIsClient(true);
    hasMounted.current = true;
  }, []);

  // Gestionnaire de clic en dehors du chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fonction pour ajouter le message de bienvenue avec effet de frappe
  const addWelcomeMessage = useCallback(async () => {
    const welcomeMessage = welcomeMessages[currentLanguage];
    const messageId = Date.now();
    
    // Ajouter d'abord un message vide
    setMessages([{
      id: messageId,
      text: '',
      isUser: false,
      isTyping: true
    }]);

    // Simuler l'effet de frappe très rapide
    let currentText = '';
    const textArray = welcomeMessage.split('');
    
    for (let i = 0; i < textArray.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 5)); // Réduit à 5ms par lettre
      currentText += textArray[i];
      setMessages([{
        id: messageId,
        text: currentText,
        isUser: false,
        isTyping: false
      }]);
    }
  }, [currentLanguage]);

  // Effet pour charger la base de connaissances
  useEffect(() => {
    if (isClient) {
      const fetchKnowledgeBase = async () => {
        const data = await loadKnowledgeBase();
        setKnowledgeBase(data);
      };
      fetchKnowledgeBase();
    }
  }, [isClient]);

  // Effet pour gérer l'ouverture/fermeture du chat
  useEffect(() => {
    if (!isClient) return;

    if (isOpen) {
      if (messages.length === 0) {
        addWelcomeMessage();
        setIsInConversation(true);
      }
    } else {
      // Réinitialiser les messages et l'état de conversation à la fermeture
      setMessages([]);
      setIsInConversation(false);
      setIsMinimized(false);
    }
  }, [isOpen, messages.length, isClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string, botResponse?: string) => {
    if (isLoading) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: message,
      isUser: true,
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setIsInConversation(true);

    try {
      // Si une réponse du bot est fournie (depuis l'API Gemini), l'utiliser directement
      if (botResponse) {
        const botMessageId = Date.now() + 1;
        
        // Ajouter la réponse avec effet de frappe rapide
        let currentText = '';
        const textArray = botResponse.split('');
        
        setMessages((prev) => [...prev, {
          id: botMessageId,
          text: '',
          isUser: false,
          isTyping: true
        }]);

        for (let i = 0; i < textArray.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 5));
          currentText += textArray[i];
          setMessages((prev) => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: currentText, isTyping: false }
              : msg
          ));
        }
      } else {
        // Sinon, utiliser l'API Gemini normale
        const detectedLanguage = await detectLanguage(message);
        if (detectedLanguage !== currentLanguage) {
          setCurrentLanguage(detectedLanguage);
        }
        
        const response = await queryGemini(message, knowledgeBase, detectedLanguage);
        const botMessageId = Date.now() + 1;
        
        // Ajouter la réponse avec effet de frappe rapide
        let currentText = '';
        const textArray = response.split('');
        
        setMessages((prev) => [...prev, {
          id: botMessageId,
          text: '',
          isUser: false,
          isTyping: true
        }]);

        for (let i = 0; i < textArray.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 5));
          currentText += textArray[i];
          setMessages((prev) => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: currentText, isTyping: false }
              : msg
          ));
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Je suis désolée, j'ai rencontré un petit problème technique. Pourriez-vous reformuler votre question ? 🙏",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const textDirection = currentLanguage === 'ar' ? 'rtl' : 'ltr';

  // Si le rendu est côté serveur ou que le composant n'est pas monté, retourner null ou un placeholder
  if (!isClient) {
    return null; // ou un placeholder si nécessaire
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        } transition-all duration-300 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shadow-xl transform hover:scale-105 group backdrop-blur-sm overflow-hidden relative animate-float`}
        style={{
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.15), 0 10px 32px rgba(0, 0, 0, 0.2)',
          transform: 'perspective(1000px) rotateX(10deg)',
          transformOrigin: 'bottom'
        }}
      >
        {/* Effet de lueur animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 animate-glow" />
        
        {/* Effet de pulsation */}
        <div className="absolute inset-0 rounded-full animate-pulse-ring" />
        
        <div className="relative w-full h-full">
          <img 
            src="/chatbot-avatar.png"
            alt="Assistant Hakach"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 animate-subtle-bounce"
          />
          <div className="absolute inset-0 ring-2 ring-amber-500/30 rounded-full" />
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30 group-hover:opacity-0 transition-opacity duration-300"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95, rotateX: 5 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              rotateX: 0,
              height: isMinimized ? '80px' : '700px'
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut",
              height: { 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] // Courbe bezier pour une animation très fluide
              }
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95, rotateX: 5 }}
            className="absolute bottom-0 right-0 w-[450px] sm:w-[500px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/20 backdrop-blur-lg transform-gpu"
            style={{ 
              maxHeight: isMinimized ? '80px' : 'calc(100vh - 50px)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3), 0 16px 48px rgba(0, 0, 0, 0.2)',
              transform: 'perspective(1000px) rotateX(2deg)',
              transformOrigin: 'bottom'
            }}
            dir={textDirection}
          >
            {/* En-tête du chat avec effet 3D amélioré */}
            <div 
              className="bg-black/70 backdrop-blur-xl text-amber-500 p-5 flex items-center justify-between relative z-10"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), 0 2px 4px rgba(245, 158, 11, 0.1)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.15)'
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div 
                    className="w-14 h-14 rounded-full relative transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3 overflow-hidden"
                    style={{
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2), 0 8px 25px rgba(0,0,0,0.15)',
                      transform: 'translateZ(25px)'
                    }}
                  >
                    <img 
                      src="/chatbot-avatar.png" 
                      alt="Assistant Hakach" 
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div 
                      className="absolute inset-0 ring-2 ring-amber-500/40 rounded-full"
                      style={{
                        boxShadow: 'inset 0 0 15px rgba(245, 158, 11, 0.15)'
                      }}
                    ></div>
                    <div 
                      className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"
                      style={{
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25), 0 0 0 2px rgba(0,0,0,0.1)',
                        animation: 'pulse 2s infinite'
                      }}
                    ></div>
                  </div>
                  {/* Effet de halo */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="transform transition-transform duration-300 hover:translate-x-1" style={{ transform: 'translateZ(15px)' }}>
                  <h3 className="font-semibold text-2xl text-amber-500 tracking-wide mb-0.5">Hakach</h3>
                  <p className="text-sm text-amber-400/80 font-medium tracking-wide">Assistant virtuel</p>
                </div>
              </div>
              <div className="flex items-center space-x-5">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-amber-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-amber-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Zone des messages avec animation */}
            <motion.div 
              className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-md"
              animate={{
                height: isMinimized ? 0 : 'auto',
                opacity: isMinimized ? 0 : 1,
                padding: isMinimized ? '0px' : '24px'
              }}
              initial={{
                height: 'auto',
                opacity: 1,
                padding: '24px'
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.4 }
              }}
              style={{
                background: 'linear-gradient(165deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                perspective: '1000px'
              }}
            >
              <div className="space-y-6 px-2" style={{ transform: 'translateZ(5px)' }}>
                {messages.map((msg) => (
                  <ChatBubble 
                    key={msg.id} 
                    message={msg.text} 
                    isUser={msg.isUser} 
                    isTyping={msg.isTyping}
                  />
                ))}
              </div>
              <div ref={messagesEndRef} />
            </motion.div>
            
            {/* Zone de saisie avec animation */}
            <motion.div 
              className="bg-black/40 backdrop-blur-md"
              animate={{
                height: isMinimized ? 0 : 'auto',
                opacity: isMinimized ? 0 : 1,
                padding: isMinimized ? '0px' : '12px 16px'
              }}
              initial={{
                height: 'auto',
                opacity: 1,
                padding: '12px 16px'
              }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.4 }
              }}
              style={{
                background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                boxShadow: '0 -8px 16px -2px rgba(0,0,0,0.15)',
                transform: 'translateZ(10px)'
              }}
            >
              <div className="max-w-[95%] mx-auto">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) perspective(1000px) rotateX(10deg); }
          50% { transform: translateY(-10px) perspective(1000px) rotateX(5deg); }
        }

        @keyframes glow {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes pulse-ring {
          0% { 
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.3),
                        0 0 0 10px rgba(245, 158, 11, 0.2),
                        0 0 0 20px rgba(245, 158, 11, 0.1);
          }
          100% { 
            box-shadow: 0 0 0 10px rgba(245, 158, 11, 0.2),
                        0 0 0 20px rgba(245, 158, 11, 0.1),
                        0 0 0 30px rgba(245, 158, 11, 0);
          }
        }

        @keyframes subtle-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 3s linear infinite;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-subtle-bounce {
          animation: subtle-bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow; 