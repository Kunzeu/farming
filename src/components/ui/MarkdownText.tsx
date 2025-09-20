import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

export default function MarkdownText({ text, className = "" }: MarkdownTextProps) {
  // Función para convertir markdown básico a HTML
  const parseMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // Patrón para enlaces markdown [texto](url)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      // Agregar texto antes del enlace
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Agregar el enlace
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Determinar si es enlace interno o externo
      const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('https');
      
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : ""}
          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
        >
          {linkText}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Agregar texto restante
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <span className={className}>
      {parseMarkdown(text)}
    </span>
  );
}
