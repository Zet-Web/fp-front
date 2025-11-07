// Mock data for Quiz 2 alternative design

import { Quiz2, Quiz2Attempt } from './quiz2-types';

export const mockQuiz2: Quiz2 = {
  id: '1',
  title: 'TypeScript Essentials',
  description: 'Master TypeScript fundamentals with this comprehensive assessment covering types, interfaces, and advanced features.',
  settings: {
    anonymous: false,
    allowPause: false,
    oneAttemptPerUser: true,
    showCorrectAnswers: true,
    hasTimer: true,
    timerMinutes: 20,
    visibility: 'public',
  },
  questions: [
    {
      id: 'q1',
      text: 'What is the main benefit of using TypeScript over JavaScript?',
      answers: [
        { id: 'a1', text: 'Static type checking', correct: true },
        { id: 'a2', text: 'Faster runtime performance', correct: false },
        { id: 'a3', text: 'Smaller bundle size', correct: false },
        { id: 'a4', text: 'Built-in UI components', correct: false },
      ],
    },
    {
      id: 'q2',
      text: 'Which of the following are valid TypeScript types?',
      answers: [
        { id: 'a5', text: 'string', correct: true },
        { id: 'a6', text: 'number', correct: true },
        { id: 'a7', text: 'float', correct: false },
        { id: 'a8', text: 'unknown', correct: true },
      ],
    },
    {
      id: 'q3',
      text: 'What does the readonly modifier do in TypeScript?',
      answers: [
        { id: 'a9', text: 'Prevents property reassignment after initialization', correct: true },
        { id: 'a10', text: 'Makes properties private', correct: false },
        { id: 'a11', text: 'Optimizes property access', correct: false },
        { id: 'a12', text: 'Creates a constant variable', correct: false },
      ],
    },
    {
      id: 'q4',
      text: 'What is a union type in TypeScript?',
      answers: [
        { id: 'a13', text: 'A type that can be one of several types', correct: true },
        { id: 'a14', text: 'A type that combines all properties', correct: false },
        { id: 'a15', text: 'A type for database unions', correct: false },
        { id: 'a16', text: 'A type for set operations', correct: false },
      ],
    },
    {
      id: 'q5',
      text: 'What is the purpose of generics in TypeScript?',
      answers: [
        { id: 'a17', text: 'Create reusable components with flexible types', correct: true },
        { id: 'a18', text: 'Generate random values', correct: false },
        { id: 'a19', text: 'Define generic functions only', correct: false },
        { id: 'a20', text: 'Create abstract base classes', correct: false },
      ],
    },
    {
      id: 'q6',
      text: 'What does the "any" type do in TypeScript?',
      answers: [
        { id: 'a21', text: 'Disables type checking for that value', correct: true },
        { id: 'a22', text: 'Accepts only primitive types', correct: false },
        { id: 'a23', text: 'Creates a union of all types', correct: false },
        { id: 'a24', text: 'Forces strict null checks', correct: false },
      ],
    },
  ],
};

export const mockQuiz2Attempts: Quiz2Attempt[] = [
  {
    id: '1',
    userName: 'Alice Cooper',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 6,
    completedAt: '2024-11-07T09:30:00Z',
  },
  {
    id: '2',
    userName: 'Bob Smith',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 5,
    completedAt: '2024-11-07T10:15:00Z',
  },
  {
    id: '3',
    userName: 'Carol White',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 6,
    completedAt: '2024-11-07T11:00:00Z',
  },
  {
    id: '4',
    userName: 'David Brown',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 4,
    completedAt: '2024-11-07T12:20:00Z',
  },
  {
    id: '5',
    userName: 'Emma Davis',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 5,
    completedAt: '2024-11-07T13:45:00Z',
  },
  {
    id: '6',
    userName: 'Frank Wilson',
    avatarUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 6,
    completedAt: '2024-11-07T14:30:00Z',
  },
];
