## Version française

Je cherchais un moyen simple de surveiller plusieurs flux RSS pour détecter des missions freelance, des recrutements, des opportunités commerciales ou des partenariats, sans payer un appel à un modèle IA pour chaque élément analysé.

Le workflow fonctionne ainsi :

1. Il se lance manuellement ou toutes les 30 minutes.
2. Il lit jusqu’à 10 flux RSS publics, un par un.
3. Il normalise les nouvelles entrées et déduplique les URL pendant 90 jours.
4. Il attribue un score selon des mots-clés configurables : critères positifs, signaux à forte valeur et exclusions.
5. Il ajoute chaque nouvelle opportunité dans Google Sheets avec les raisons du score.
6. Il envoie un récapitulatif Gmail uniquement lorsqu’une opportunité atteint le seuil défini.

J’ai volontairement conservé un scoring déterministe. Les poids et les raisons sont visibles, il n’y a aucun coût d’API IA et chacun peut adapter les règles à son marché. Cela évite aussi d’envoyer directement du contenu RSS non fiable à un modèle.

Le workflow n’envoie jamais de candidature ni de message de prospection. Gmail sert uniquement à transmettre les opportunités à vérifier : la décision reste humaine.

Template officiel :

https://n8n.io/workflows/17715-score-rss-opportunities-to-google-sheets-and-send-priority-digests-with-gmail/?utm_source=n8n&utm_medium=community&utm_campaign=ai-opportunity-monitor&utm_content=fr

Code, guide d’installation et structure Google Sheets :

https://github.com/mandaniainarandriambinintsoa/n8n-ai-opportunity-monitor?utm_source=n8n&utm_medium=community&utm_campaign=ai-opportunity-monitor&utm_content=fr

Je suis particulièrement intéressé par vos retours sur deux choix : la déduplication légère avec les données statiques du workflow et le scoring par mots-clés plutôt que par LLM. Qu’est-ce que vous modifieriez dans une version destinée à être réutilisée par la communauté ?
