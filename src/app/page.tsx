import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-500">Assistant Virtuel Hakach Transfert</h1>
      
      <div className="max-w-2xl mx-auto bg-black p-6 rounded-lg shadow-2xl border border-amber-500">
        <h2 className="text-xl font-semibold mb-6 text-amber-500 border-b border-amber-500 pb-2">Comment utiliser ce widget</h2>
        
        <div className="space-y-5">
          <p className="text-gray-300">
            Ce widget d&apos;assistant virtuel élégant peut être facilement intégré dans votre site web ou application PHP pour Hakach Transfert.
          </p>
          
          <h3 className="text-lg font-medium text-amber-500 mt-6">Instructions d&apos;intégration</h3>
          
          <div className="bg-gray-800 p-5 rounded-lg border border-amber-500/30">
            <p className="font-mono text-sm text-gray-300">
              {`<script src="https://votredomaine.com/widget/assistant-virtuel.js"></script>`}
            </p>
            <p className="font-mono text-sm mt-3 text-gray-300">
              {`<script>
  window.AssistantVirtuel.init({
    apiKey: 'votre_clé_api_gemini',
    knowledgeBaseUrl: 'https://votredomaine.com/data/knowledge_base.json',
    primaryColor: '#f59e0b',
    backgroundColor: '#000000',
    widgetTitle: 'Assistant Hakach Transfert'
  });
</script>`}
            </p>
          </div>
          
          <p className="text-gray-300">
            Vous pouvez personnaliser l&apos;apparence et le comportement du widget en modifiant les options de configuration.
          </p>
          
          <h3 className="text-lg font-medium text-amber-500 mt-6">Fonctionnalités</h3>
          
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Interface utilisateur élégante aux couleurs de Hakach Transfert (noir et doré)</li>
            <li>Basé sur l&apos;API Gemini de Google pour des réponses intelligentes et contextuelles</li>
            <li>Utilise une base de connaissances personnalisée sur les services de transfert d&apos;argent</li>
            <li>Animations fluides pour une expérience utilisateur premium</li>
            <li>Répond aux questions sur les transferts, les pays supportés, les frais et la sécurité</li>
            <li>Design adaptatif pour tous les appareils (desktop, mobile, tablette)</li>
          </ul>
        </div>
      </div>
      
      {/* Le widget de chatbot est ajouté ici */}
      <ChatWindow />
    </main>
  );
}
