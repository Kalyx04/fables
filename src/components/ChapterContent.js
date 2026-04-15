import styles from './ChapterContent.module.css';

export default function ChapterContent({ content }) {
  if (!content || !content.content) return null;

  const renderNode = (node, index) => {
    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </p>
        );
      case 'text':
        let element = <>{node.text}</>;
        
        if (node.marks) {
          node.marks.forEach(mark => {
            if (mark.type === 'bold') element = <strong>{element}</strong>;
            if (mark.type === 'italic') element = <em>{element}</em>;
            if (mark.type === 'underline') element = <u style={{ textDecoration: 'underline' }}>{element}</u>;
            if (mark.type === 'link') element = <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer">{element}</a>;
          });
        }
        return <span key={index}>{element}</span>;
      case 'heading':
        const Tag = `h${node.attrs?.level || 1}`;
        return (
          <Tag key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </Tag>
        );
      case 'blockquote':
        return (
          <blockquote key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </blockquote>
        );
      case 'hardBreak':
        return <br key={index} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.content}>
      {content.content.map((node, i) => renderNode(node, i))}
    </div>
  );
}
