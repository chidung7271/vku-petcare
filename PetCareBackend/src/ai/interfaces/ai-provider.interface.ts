export interface AIHealthAssistantResponse {
  riskLevel: 'CRITICAL' | 'CONSULT_VET' | 'MONITOR';
  answer: string;
  immediateActions: string[];
  warningSigns: string[];
  whenToSeeVet: string;
  followUpQuestions: string[];
  sources?: string;
  disclaimer: string;
}

export interface AIProvider {
  ask(
    question: string, 
    context?: Record<string, any>, 
    history?: { role: 'user' | 'model'; text: string }[]
  ): Promise<AIHealthAssistantResponse>;
}
