// Mock data for Quiz testing components

import { Quiz, QuizAttempt } from './quiz-types';

export const mockQuiz: Quiz = {
  id: '1',
  title: 'React Fundamentals Assessment',
  description: 'Test your knowledge of React fundamentals including components, hooks, and state management.',
  settings: {
    anonymous: false,
    allowPause: false,
    oneAttemptPerUser: true,
    showCorrectAnswers: true,
    hasTimer: true,
    timerMinutes: 15,
    visibility: 'public',
  },
  questions: [
    {
      id: 'q1',
      text: 'What is the purpose of useState hook in React?',
      answers: [
        { id: 'a1', text: 'To manage component state', correct: true },
        { id: 'a2', text: 'To fetch data from APIs', correct: false },
        { id: 'a3', text: 'To handle side effects', correct: false },
        { id: 'a4', text: 'To create context providers', correct: false },
      ],
    },
    {
      id: 'q2',
      text: 'Which of the following are valid React lifecycle methods?',
      answers: [
        { id: 'a5', text: 'componentDidMount', correct: true },
        { id: 'a6', text: 'componentWillUpdate', correct: true },
        { id: 'a7', text: 'componentDidRender', correct: false },
        { id: 'a8', text: 'componentWillUnmount', correct: true },
      ],
    },
    {
      id: 'q3',
      text: 'What does the useEffect hook do?',
      answers: [
        { id: 'a9', text: 'Manages side effects in functional components', correct: true },
        { id: 'a10', text: 'Optimizes component rendering', correct: false },
        { id: 'a11', text: 'Creates ref objects', correct: false },
        { id: 'a12', text: 'Defines component props', correct: false },
      ],
    },
    {
      id: 'q4',
      text: 'Which statement about React keys is true?',
      answers: [
        { id: 'a13', text: 'Keys help React identify which items have changed', correct: true },
        { id: 'a14', text: 'Keys must be globally unique', correct: false },
        { id: 'a15', text: 'Keys are optional for list items', correct: false },
        { id: 'a16', text: 'Index should always be used as key', correct: false },
      ],
    },
    {
      id: 'q5',
      text: 'What is prop drilling in React?',
      answers: [
        { id: 'a17', text: 'Passing props through multiple levels of components', correct: true },
        { id: 'a18', text: 'Drilling holes in component structure', correct: false },
        { id: 'a19', text: 'A method to optimize performance', correct: false },
        { id: 'a20', text: 'A type of React hook', correct: false },
      ],
    },
  ],
};

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 5,
    completedAt: '2024-11-07T10:30:00Z',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 4,
    completedAt: '2024-11-07T11:15:00Z',
  },
  {
    id: '3',
    userName: 'Emily Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 5,
    completedAt: '2024-11-07T12:00:00Z',
  },
  {
    id: '4',
    userName: 'David Kim',
    avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 3,
    completedAt: '2024-11-07T13:20:00Z',
  },
  {
    id: '5',
    userName: 'Alex Martinez',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    score: 4,
    completedAt: '2024-11-07T14:45:00Z',
  },
];
