export interface Question {
  id: string;
  text: string;
  answer: string;
  isRevised: boolean;
  setId: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
}
