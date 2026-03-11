export interface Problem {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  points?: number;
  passingPercent?: number;
  testCases?: TestCase[];
  constraints?: string[];
  inputFormat?: string;
  outputFormat?: string;
  examples?: any[];
}

export interface TestCase {
  label?: string;
  inputs: string[];
  expected: string[];
  hidden?: boolean;
}

export interface Lab {
  id: string;
  title: string;
  dueDate?: string;
  passingPercent?: number;
  problems: Problem[];
  active?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  topic?: string;
  questions: Question[];
  active?: boolean;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'code_output' | 'fill_blank';
  question: string;
  choices?: string[];
  answer: string;
  explanation?: string;
}

export interface Profile {
  id: string;
  username: string;
  exp: number;
  rank: string;
}
