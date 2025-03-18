import { redirect } from 'next/navigation';

/**
 * Root page - redirects to leads page or login page based on auth status
 */
export default function Home() {
  // In SSR context, we redirect to the login page
  // The client-side auth check will handle redirecting to the dashboard if logged in
  redirect('/login');
}