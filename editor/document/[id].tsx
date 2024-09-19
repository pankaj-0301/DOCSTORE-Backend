import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Document, Packer, Paragraph, TextRun, PageOrientation , UnderlineType} from 'docx';

const DocumentDisplay = () => {
  const router = useRouter();
  const { id } = router.query; // Get document ID from URL
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title,setTitle]=useState('Untitled');

  useEffect(() => {
    if (id) { // Ensure that 'id' is available
      const fetchDocument = async () => {
        try {
          const response = await axios.get(`https://docsharing-backend.onrender.com/api/document/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
           // Set content from the response
        } catch (err) {
          setError('Failed to fetch document.');
        } finally {
          setLoading(false);
        }
      };

      fetchDocument();
    }
  }, [id]);

  const htmlToDocx = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const paragraphs = Array.from(doc.body.childNodes).map((node) => {
      if (node.nodeName === 'P') {
        const textRuns = Array.from(node.childNodes).map((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            return new TextRun(child.textContent || '');
          } else if (child.nodeName === 'STRONG') {
            return new TextRun({
              text: child.textContent || '',
              bold: true,
            });
          } else if (child.nodeName === 'EM') {
            return new TextRun({
              text: child.textContent || '',
              italics: true,
            });
          } else if (child.nodeName === 'U') {
            return new TextRun({
              text: child.textContent || '',
              underline: {
                color: undefined, // You can specify color if needed
                type: UnderlineType.SINGLE, // Choose the underline type
              },
            });
          } else if (child.nodeName === 'A') {
            // Handle links
            const anchor = child as HTMLAnchorElement;
            return new TextRun({
              text: anchor.textContent || '',
              color: '0000FF', // Blue color for links
              underline: {
                color: undefined,
                type: UnderlineType.SINGLE, // Underline to indicate hyperlink
              },
              // Hypothetical approach for adding hyperlinks if supported
              // Note: This may not work directly if 'hyperlink' is not supported
            });
          } else if (child.nodeName === 'S') {
            return new TextRun({
              text: child.textContent || '',
              strike: true,
            });
          } else {
            return new TextRun(child.textContent || '');
          }
        });
  
        return new Paragraph({
          children: textRuns,
        });
      }
      return null;
    }).filter((paragraph): paragraph is Paragraph => paragraph !== null); // Filter out null values
  
    return new Document({
      sections: [{
        properties: {
          page: {
            size: {
              width: 11906, // A4 width (8.27 inches)
              height: 16838, // A4 height (11.69 inches)
              orientation: PageOrientation.PORTRAIT,
            },
            margin: {
              top: 1440, // 1 inch = 1440 Twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      }],
    });
  };
  

  const downloadDocFile = async () => {
    const doc = htmlToDocx(content);

    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div
        style={{
          width: '210mm', // A4 width
          minHeight: '297mm', // Extendable height
          padding: '20mm',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '1px solid rgba(0, 0, 0, 0.1)', // Subtle border
          boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.2)', // Floating effect with soft shadow
          transform: 'translateY(-10px)', // Slightly lifted up
          transition: 'all 0.3s ease-in-out', // Smooth transitions for hover
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget.style.transform = 'translateY(-20px)');
          (e.currentTarget.style.boxShadow = '0px 20px 35px rgba(0, 0, 0, 0.3)');
        }}
        onMouseLeave={(e) => {
          (e.currentTarget.style.transform = 'translateY(-10px)');
          (e.currentTarget.style.boxShadow = '0px 15px 25px rgba(0, 0, 0, 0.2)');
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h1>
        <div
          className="editor-contenteditable"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ margin: '10px 0', textAlign: 'justify', lineHeight: '1.5' }}
        />
         <button
          onClick={downloadDocFile}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Download as .docx
        </button>
      </div>
    </div>
  );
};

export default DocumentDisplay;
