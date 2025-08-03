import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface GlossaryLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GlossaryLink({ className = '', children }: GlossaryLinkProps) {
  return (
    <Link 
      href="/glossary" 
      className={`inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 ${className}`}
    >
      <BookOpen className="h-4 w-4" />
      <span>{children || 'View more concepts in the Glossary'}</span>
    </Link>
  );
} 