import type { NewsArticle, Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const news: NewsArticle[] = [
  { id: 'news-1', title: 'Annual Community Picnic Next Saturday!', content: 'Join us for a day of fun, food, and fellowship at our annual community picnic. All are welcome! We will have games for kids, a barbecue, and live music. The event starts at 11 AM at Central Park. We hope to see you there!', imageUrl: getImage('news-1'), publishedAt: '2023-11-10', author: 'Jane Doe' },
  { id: 'news-2', title: 'New Youth Group Leadership Program', content: 'We are excited to launch a new leadership program for our youth group members aged 14-18. This program will focus on developing skills in communication, teamwork, and service. Sign-ups are open until the end of the month.', imageUrl: getImage('news-2'), publishedAt: '2023-11-05', author: 'John Davis' },
  { id: 'news-3', title: 'Call for Volunteers for the Winter Shelter', content: 'As the weather gets colder, our local winter shelter needs more hands. We are looking for volunteers to help with meal service, cleaning, and administrative tasks. Your support can make a huge difference.', imageUrl: getImage('news-3'), publishedAt: '2023-11-01', author: 'Admin' },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'John D.',
    role: 'Student',
    quote: 'This platform was a lifeline for me during a really tough semester. The guidance I received was compassionate, practical, and helped me find my footing again. I am incredibly grateful.',
    avatarUrl: getImage('testimonial-1')
  },
  {
    id: 'test-2',
    name: 'Sarah K.',
    role: 'Recent Graduate',
    quote: 'I was struggling with career decisions, and the mentorship I found here was invaluable. Speaking to a professional in my field who shared my values made all the difference.',
    avatarUrl: getImage('testimonial-2')
  },
  {
    id: 'test-3',
    name: 'Michael P.',
    role: 'Community Member',
    quote: 'The spiritual counseling provided clarity and peace during a difficult family situation. It\'s a blessing to have such a confidential and caring resource within our church community.',
    avatarUrl: getImage('testimonial-3')
  }
];
