import { NextResponse } from 'next/server';

export async function GET() {
  // Code JavaScript qui sera utilisé pour intégrer le widget
  const widgetScript = `
// Assistant Virtuel Widget
(function() {
  // Configuration par défaut
  const defaultConfig = {
    apiKey: '',
    knowledgeBaseUrl: '/data/knowledge_base.json',
    position: 'bottom-right',
    primaryColor: '#f59e0b',
    backgroundColor: '#000000',
    widgetTitle: 'Assistant Hakach Transfert',
    defaultLanguage: 'fr',
    supportedLanguages: {
      fr: 'Français',
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      ar: 'العربية'
    }
  };

  // Messages de bienvenue par langue
  const welcomeMessages = {
    fr: "Bonjour ! Je suis l'assistant virtuel de Hakach Transfert. Comment puis-je vous aider avec vos transferts d'argent aujourd'hui ?",
    en: "Hello! I am the Hakach Transfert virtual assistant. How can I help you with your money transfers today?",
    es: "¡Hola! Soy el asistente virtual de Hakach Transfert. ¿Cómo puedo ayudarte con tus transferencias de dinero hoy?",
    de: "Hallo! Ich bin der virtuelle Assistent von Hakach Transfert. Wie kann ich Ihnen heute bei Ihren Geldüberweisungen helfen?",
    ar: "مرحبًا! أنا المساعد الافتراضي لخدمة حكاش للتحويلات. كيف يمكنني مساعدتك في تحويلاتك المالية اليوم؟"
  };

  // Messages d'erreur par langue
  const errorMessages = {
    fr: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.",
    en: "Sorry, I could not process your request. Please try again later.",
    es: "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
    de: "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten. Bitte versuchen Sie es später noch einmal.",
    ar: "عذرًا، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا."
  };

  // Textes de l'interface par langue
  const uiTexts = {
    fr: {
      placeholder: "Posez votre question...",
      thinking: "Je réfléchis...",
      selectLanguage: "Changer de langue"
    },
    en: {
      placeholder: "Ask your question...",
      thinking: "I'm thinking...",
      selectLanguage: "Change language"
    },
    es: {
      placeholder: "Haz tu pregunta...",
      thinking: "Estoy pensando...",
      selectLanguage: "Cambiar idioma"
    },
    de: {
      placeholder: "Stellen Sie Ihre Frage...",
      thinking: "Ich denke nach...",
      selectLanguage: "Sprache ändern"
    },
    ar: {
      placeholder: "اطرح سؤالك...",
      thinking: "أنا أفكر...",
      selectLanguage: "تغيير اللغة"
    }
  };

  // Icônes pour les langues
  const languageIcons = {
    fr: "🇫🇷",
    en: "🇬🇧",
    es: "🇪🇸",
    de: "🇩🇪",
    ar: "🇸🇦"
  };

  // Widget singleton
  let widgetInstance = null;

  class AssistantVirtuelWidget {
    constructor(config = {}) {
      this.config = { ...defaultConfig, ...config };
      this.messages = [];
      this.isOpen = false;
      this.isLoading = false;
      this.isThinking = false;
      this.knowledgeBase = [];
      this.container = null;
      this.chatWindow = null;
      this.messagesContainer = null;
      this.currentLanguage = this.config.defaultLanguage || 'fr';
      
      this.init();
    }

    async init() {
      // Charger les styles
      this.loadStyles();
      
      // Créer les éléments du widget
      this.createWidgetElements();
      
      // Charger la base de connaissances
      try {
        const response = await fetch(this.config.knowledgeBaseUrl);
        if (response.ok) {
          this.knowledgeBase = await response.json();
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la base de connaissances:', error);
      }

      // Ajouter un message de bienvenue
      this.addMessage({
        text: welcomeMessages[this.currentLanguage] || welcomeMessages.fr,
        isUser: false
      });
    }

    loadStyles() {
      const style = document.createElement('style');
      style.textContent = \`
        .av-widget-container * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        .av-widget-container {
          position: fixed;
          z-index: 9999;
          bottom: 20px;
          right: 20px;
        }
        .av-chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: \${this.config.backgroundColor};
          color: \${this.config.primaryColor};
          border: 2px solid \${this.config.primaryColor};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .av-chat-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }
        .av-chat-toggle.hidden {
          transform: scale(0);
          opacity: 0;
        }
        .av-chat-window {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 370px;
          height: 600px;
          max-height: 70vh;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
          border: 1px solid \${this.config.primaryColor};
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .av-chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        .av-chat-header {
          padding: 16px;
          background-color: \${this.config.backgroundColor};
          color: \${this.config.primaryColor};
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid \${this.config.primaryColor};
        }
        .av-chat-header-title {
          display: flex;
          align-items: center;
        }
        .av-chat-header-icon {
          margin-right: 12px;
          display: flex;
          align-items: center;
        }
        .av-current-language {
          display: flex;
          align-items: center;
          font-size: 12px;
          margin-top: 4px;
          color: #f59e0b;
          opacity: 0.8;
        }
        .av-language-flag {
          margin-right: 5px;
        }
        .av-language-selector {
          position: relative;
        }
        .av-language-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 8px;
          background-color: #000;
          border: 1px solid \${this.config.primaryColor};
          border-radius: 8px;
          overflow: hidden;
          width: 150px;
          z-index: 10;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease-in-out;
        }
        .av-language-selector:hover .av-language-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .av-language-option {
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: white;
          transition: background-color 0.2s;
          text-align: left;
          width: 100%;
          border: none;
          background: none;
        }
        .av-language-option:hover {
          background-color: #333;
        }
        .av-language-option.active {
          background-color: rgba(245, 158, 11, 0.2);
          color: \${this.config.primaryColor};
        }
        .av-language-flag {
          margin-right: 8px;
        }
        .av-chat-close {
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .av-chat-close:hover {
          opacity: 1;
        }
        .av-messages-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #1f1f1f;
        }
        .av-message {
          max-width: 80%;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 14px;
          line-height: 1.5;
          font-size: 14px;
          animation: av-message-appear 0.3s ease-out;
        }
        @keyframes av-message-appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .av-message.user {
          background-color: \${this.config.backgroundColor};
          color: white;
          margin-left: auto;
          border-top-right-radius: 0;
          border: 1px solid \${this.config.primaryColor};
        }
        .av-message.bot {
          background: linear-gradient(to right, \${this.config.primaryColor}, #fbbf24);
          color: black;
          margin-right: auto;
          border-top-left-radius: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .av-typing-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 24px;
        }
        .av-typing-dot {
          width: 8px;
          height: 8px;
          margin: 0 2px;
          background-color: #111;
          border-radius: 50%;
          animation: av-typing-animation 1.4s infinite ease-in-out;
        }
        .av-typing-dot:nth-child(1) { animation-delay: 0s; }
        .av-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .av-typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes av-typing-animation {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .av-thinking-indicator {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
        .av-thinking-bubble {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #000;
          border: 1px solid \${this.config.primaryColor};
          border-radius: 20px;
          color: \${this.config.primaryColor};
          font-size: 13px;
        }
        .av-thinking-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: \${this.config.primaryColor};
          border-radius: 50%;
          margin-right: 8px;
          animation: av-spin 1s linear infinite;
        }
        @keyframes av-spin {
          to { transform: rotate(360deg); }
        }
        .av-input-container {
          padding: 16px;
          background-color: \${this.config.backgroundColor};
          border-top: 1px solid \${this.config.primaryColor};
          display: flex;
        }
        .av-input {
          flex: 1;
          padding: 12px;
          border: 1px solid \${this.config.primaryColor};
          background-color: #2a2a2a;
          color: white;
          border-radius: 20px 0 0 20px;
          outline: none;
          font-size: 14px;
        }
        .av-input::placeholder {
          color: #999;
        }
        .av-input:focus {
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
        }
        .av-send-button {
          background: linear-gradient(to right, \${this.config.primaryColor}, #fbbf24);
          color: black;
          border: none;
          border-radius: 0 20px 20px 0;
          padding: 0 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .av-send-button:hover {
          filter: brightness(1.1);
        }
        .av-send-button:disabled {
          background: #444;
          cursor: not-allowed;
          color: #777;
        }
        .av-loading {
          display: flex;
          justify-content: center;
          padding: 16px;
        }
        .av-loading-dots {
          display: flex;
          align-items: center;
        }
        .av-loading-dot {
          width: 8px;
          height: 8px;
          background-color: \${this.config.primaryColor};
          border-radius: 50%;
          margin: 0 3px;
          animation: av-dot-pulse 1.5s infinite ease-in-out;
        }
        .av-loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .av-loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes av-dot-pulse {
          0%, 100% { transform: scale(0.7); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
        }
        
        /* Styles RTL pour la langue arabe */
        [dir="rtl"] .av-message.user {
          margin-left: 0;
          margin-right: auto;
          border-top-right-radius: 12px;
          border-top-left-radius: 0;
        }
        [dir="rtl"] .av-message.bot {
          margin-right: 0;
          margin-left: auto;
          border-top-left-radius: 12px;
          border-top-right-radius: 0;
        }
        [dir="rtl"] .av-chat-header-icon {
          margin-right: 0;
          margin-left: 12px;
        }
        [dir="rtl"] .av-language-flag {
          margin-right: 0;
          margin-left: 8px;
        }
        [dir="rtl"] .av-thinking-spinner {
          margin-right: 0;
          margin-left: 8px;
        }
        [dir="rtl"] .av-input {
          border-radius: 0 20px 20px 0;
        }
        [dir="rtl"] .av-send-button {
          border-radius: 20px 0 0 20px;
        }
      \`;
      document.head.appendChild(style);
    }

    createWidgetElements() {
      // Conteneur principal
      this.container = document.createElement('div');
      this.container.className = 'av-widget-container';
      
      // Bouton pour ouvrir/fermer le chat
      const toggleButton = document.createElement('button');
      toggleButton.className = 'av-chat-toggle';
      toggleButton.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      \`;
      toggleButton.addEventListener('click', () => this.toggleChat());
      
      // Fenêtre de chat
      this.chatWindow = document.createElement('div');
      this.chatWindow.className = 'av-chat-window';
      
      // Définir la direction du texte en fonction de la langue
      this.updateTextDirection();
      
      // En-tête
      const header = document.createElement('div');
      header.className = 'av-chat-header';
      
      // Conteneur du titre
      const titleContainer = document.createElement('div');
      titleContainer.className = 'av-chat-header-title';
      
      const headerIcon = document.createElement('div');
      headerIcon.className = 'av-chat-header-icon';
      headerIcon.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      \`;
      
      // Div du titre et langue
      const titleInfoContainer = document.createElement('div');
      
      const headerTitle = document.createElement('span');
      headerTitle.textContent = this.config.widgetTitle;
      headerTitle.style.fontSize = '16px';
      
      // Indicateur de langue actuelle
      const currentLanguageIndicator = document.createElement('div');
      currentLanguageIndicator.className = 'av-current-language';
      currentLanguageIndicator.innerHTML = \`
        <span class="av-language-flag">\${languageIcons[this.currentLanguage]}</span>
        <span>\${this.config.supportedLanguages[this.currentLanguage]}</span>
      \`;
      
      titleInfoContainer.appendChild(headerTitle);
      titleInfoContainer.appendChild(currentLanguageIndicator);
      
      titleContainer.appendChild(headerIcon);
      titleContainer.appendChild(titleInfoContainer);
      
      // Actions header (langue + fermeture)
      const headerActions = document.createElement('div');
      headerActions.style.display = 'flex';
      headerActions.style.alignItems = 'center';
      headerActions.style.gap = '8px';
      
      // Sélecteur de langue
      const languageSelector = document.createElement('div');
      languageSelector.className = 'av-language-selector';
      
      const languageButton = document.createElement('button');
      languageButton.style.background = 'none';
      languageButton.style.border = 'none';
      languageButton.style.color = this.config.primaryColor;
      languageButton.style.cursor = 'pointer';
      languageButton.style.padding = '4px';
      languageButton.style.display = 'flex';
      languageButton.style.alignItems = 'center';
      languageButton.style.justifyContent = 'center';
      languageButton.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
        </svg>
      \`;
      
      // Menu des langues
      const languageMenu = document.createElement('div');
      languageMenu.className = 'av-language-menu';
      
      // Créer les options de langue
      Object.entries(this.config.supportedLanguages).forEach(([langCode, langName]) => {
        const langOption = document.createElement('button');
        langOption.className = \`av-language-option \${this.currentLanguage === langCode ? 'active' : ''}\`;
        langOption.innerHTML = \`<span class="av-language-flag">\${languageIcons[langCode]}</span> \${langName}\`;
        langOption.addEventListener('click', () => this.changeLanguage(langCode));
        languageMenu.appendChild(langOption);
      });
      
      languageSelector.appendChild(languageButton);
      languageSelector.appendChild(languageMenu);
      
      // Bouton de fermeture
      const closeButton = document.createElement('div');
      closeButton.className = 'av-chat-close';
      closeButton.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      \`;
      closeButton.addEventListener('click', () => this.toggleChat());
      
      headerActions.appendChild(languageSelector);
      headerActions.appendChild(closeButton);
      
      header.appendChild(titleContainer);
      header.appendChild(headerActions);
      
      // Conteneur des messages
      this.messagesContainer = document.createElement('div');
      this.messagesContainer.className = 'av-messages-container';
      
      // Conteneur d'entrée
      const inputContainer = document.createElement('div');
      inputContainer.className = 'av-input-container';
      
      // Champ de texte
      const input = document.createElement('input');
      input.className = 'av-input';
      input.type = 'text';
      input.placeholder = this.getUiText('placeholder');
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isLoading && input.value.trim()) {
          this.sendMessage(input.value);
          input.value = '';
        }
      });
      
      // Bouton d'envoi
      const sendButton = document.createElement('button');
      sendButton.className = 'av-send-button';
      sendButton.innerHTML = \`
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      \`;
      sendButton.addEventListener('click', () => {
        if (!this.isLoading && input.value.trim()) {
          this.sendMessage(input.value);
          input.value = '';
        }
      });
      
      // Assembler les éléments
      inputContainer.appendChild(input);
      inputContainer.appendChild(sendButton);
      
      this.chatWindow.appendChild(header);
      this.chatWindow.appendChild(this.messagesContainer);
      this.chatWindow.appendChild(inputContainer);
      
      this.container.appendChild(this.chatWindow);
      this.container.appendChild(toggleButton);
      
      // Ajouter au document
      document.body.appendChild(this.container);
    }
    
    // Mettre à jour la direction du texte en fonction de la langue
    updateTextDirection() {
      const isRtl = this.currentLanguage === 'ar';
      this.chatWindow.dir = isRtl ? 'rtl' : 'ltr';
    }
    
    // Obtenir le texte de l'interface dans la langue actuelle
    getUiText(key) {
      return uiTexts[this.currentLanguage]?.[key] || uiTexts.fr[key];
    }
    
    // Changer la langue de l'interface
    changeLanguage(langCode) {
      if (this.config.supportedLanguages[langCode]) {
        this.currentLanguage = langCode;
        
        // Mettre à jour la direction du texte
        this.updateTextDirection();
        
        // Mettre à jour l'indicateur de langue
        const currentLanguageIndicator = this.container.querySelector('.av-current-language');
        if (currentLanguageIndicator) {
          currentLanguageIndicator.innerHTML = \`
            <span class="av-language-flag">\${languageIcons[this.currentLanguage]}</span>
            <span>\${this.config.supportedLanguages[this.currentLanguage]}</span>
          \`;
        }
        
        // Mettre à jour les classes actives dans le menu des langues
        const languageOptions = this.container.querySelectorAll('.av-language-option');
        languageOptions.forEach(option => {
          if (option.textContent.includes(this.config.supportedLanguages[langCode])) {
            option.classList.add('active');
          } else {
            option.classList.remove('active');
          }
        });
        
        // Mettre à jour le placeholder de l'entrée
        const input = this.container.querySelector('.av-input');
        if (input) {
          input.placeholder = this.getUiText('placeholder');
        }
      }
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      
      const toggleButton = this.container.querySelector('.av-chat-toggle');
      
      if (this.isOpen) {
        this.chatWindow.classList.add('open');
        toggleButton.classList.add('hidden');
        // Faire défiler vers le bas
        this.scrollToBottom();
      } else {
        this.chatWindow.classList.remove('open');
        toggleButton.classList.remove('hidden');
      }
    }

    addMessage(message, isTyping = false) {
      this.messages.push(message);
      
      const messageElement = document.createElement('div');
      messageElement.className = \`av-message \${message.isUser ? 'user' : 'bot'}\`;
      
      if (isTyping) {
        // Si c'est un message en train d'être tapé, ajouter l'animation de frappe
        messageElement.innerHTML = \`
          <div class="av-typing-indicator">
            <span class="av-typing-dot"></span>
            <span class="av-typing-dot"></span>
            <span class="av-typing-dot"></span>
          </div>
        \`;
      } else {
        messageElement.textContent = message.text;
      }
      
      this.messagesContainer.appendChild(messageElement);
      this.scrollToBottom();
      
      return messageElement;
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async detectLanguage(text) {
      try {
        // Appeler l'API Gemini pour détecter la langue
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { 
                    text: \`
                    Détecte la langue utilisée dans ce texte et réponds uniquement avec le code ISO de la langue (fr, en, es, de, ar) sans explication supplémentaire.
                    
                    Texte: "\${text}"
                    
                    Réponds uniquement avec "fr", "en", "es", "de", ou "ar".
                    \`
                  }
                ]
              }
            ]
          })
        });
        
        if (!response.ok) {
          return this.currentLanguage;
        }
        
        const data = await response.json();
        const detectedLang = data.candidates[0].content.parts[0].text.trim().toLowerCase();
        
        // Vérifier si la langue détectée est prise en charge
        if (this.config.supportedLanguages[detectedLang]) {
          return detectedLang;
        }
        
        return this.currentLanguage;
      } catch (error) {
        console.error('Erreur lors de la détection de la langue:', error);
        return this.currentLanguage;
      }
    }

    async sendMessage(text) {
      if (this.isLoading) return;
      
      // Ajouter le message de l'utilisateur
      this.addMessage({ text, isUser: true });
      
      // Activer les indicateurs de chargement
      this.isLoading = true;
      
      // Créer l'indicateur de réflexion
      const thinkingIndicator = document.createElement('div');
      thinkingIndicator.className = 'av-thinking-indicator';
      thinkingIndicator.innerHTML = \`
        <div class="av-thinking-bubble">
          <div class="av-thinking-spinner"></div>
          <span>\${this.getUiText('thinking')}</span>
        </div>
      \`;
      this.messagesContainer.appendChild(thinkingIndicator);
      this.scrollToBottom();
      
      try {
        // Détecter la langue du message
        const detectedLanguage = await this.detectLanguage(text);
        
        // Si la langue détectée est différente de la langue actuelle, changer la langue
        if (detectedLanguage !== this.currentLanguage) {
          this.changeLanguage(detectedLanguage);
        }
        
        // Attendre un peu pour simuler la réflexion
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Supprimer l'indicateur de réflexion
        this.messagesContainer.removeChild(thinkingIndicator);
        
        // Ajouter un message temporaire avec animation de frappe
        const typingElement = this.addMessage({ text: '', isUser: false }, true);
        
        // Préparer le prompt
        const context = this.knowledgeBase
          .map(item => \`Q: \${item.question}\\nA: \${item.answer}\`)
          .join('\\n\\n');
          
        const prompt = \`
Vous êtes l'assistant virtuel élégant de Hakach Transfert, une plateforme premium de transfert d'argent sécurisée. Voici une base de connaissances sur les services Hakach :

\${context}

L'utilisateur parle en \${this.config.supportedLanguages[this.currentLanguage]}.
Question de l'utilisateur : \${text}

Si la question est liée à un élément de la base de connaissances, répondez en utilisant ces informations.
Si la question n'est pas liée aux services de transfert d'argent ou à Hakach, répondez poliment que vous êtes spécialisé dans les services de transfert d'argent Hakach et demandez comment vous pouvez aider avec ces services.

Gardez ces directives à l'esprit :
- Adoptez un ton professionnel mais chaleureux, comme un conseiller financier de confiance
- Soyez concis et précis dans vos réponses
- Utilisez un langage simple et accessible
- Montrez que vous êtes là pour aider l'utilisateur avec ses transferts d'argent
- Évitez le jargon technique sauf si nécessaire
- Répondez TOUJOURS dans la même langue que celle utilisée par l'utilisateur (\${this.config.supportedLanguages[this.currentLanguage]})
\`;

        // Appeler l'API Gemini
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': this.config.apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'appel à l\'API Gemini');
        }
        
        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        
        // Calculer la durée de la frappe en fonction de la longueur de la réponse
        const typingDuration = Math.min(Math.max(botResponse.length * 15, 800), 3000);
        
        // Simuler la frappe
        await new Promise(resolve => setTimeout(resolve, typingDuration));
        
        // Supprimer l'élément de frappe
        this.messagesContainer.removeChild(typingElement);
        
        // Ajouter la réponse du bot
        this.addMessage({ text: botResponse, isUser: false });
      } catch (error) {
        console.error('Erreur:', error);
        
        // Supprimer tous les indicateurs
        const loadingElements = this.container.querySelectorAll('.av-thinking-indicator, .av-message .av-typing-indicator');
        loadingElements.forEach(el => {
          if (el.parentNode.classList.contains('av-message')) {
            this.messagesContainer.removeChild(el.parentNode);
          } else if (el.parentNode === this.messagesContainer) {
            this.messagesContainer.removeChild(el);
          }
        });
        
        // Ajouter un message d'erreur
        this.addMessage({ 
          text: errorMessages[this.currentLanguage] || errorMessages.fr, 
          isUser: false 
        });
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Exposer l'initialisation dans l'objet global window
  window.AssistantVirtuel = {
    init: function(config) {
      if (!widgetInstance) {
        widgetInstance = new AssistantVirtuelWidget(config);
      }
      return widgetInstance;
    }
  };
})();
  `;

  return new NextResponse(widgetScript, {
    headers: {
      'Content-Type': 'application/javascript',
    },
  });
} 