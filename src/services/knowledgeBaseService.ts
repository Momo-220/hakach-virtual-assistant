// Types pour la base de connaissances
export interface KnowledgeItem {
  question: string;
  answer: string;
}

// Fonction pour charger la base de connaissances depuis le fichier JSON
export async function loadKnowledgeBase(): Promise<KnowledgeItem[]> {
  try {
    const response = await fetch('/data/knowledge_base.json');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data: KnowledgeItem[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du chargement de la base de connaissances:', error);
    return [];
  }
} 