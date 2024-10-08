import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function MarkdownPreview() {
    const [post, setPost] = useState('# Your markdown here');

    useEffect(() => {
        fetch('/resources/posts/post.md').then(res => {
            res.text().then(data => {
                setPost(data);
            });
        });
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <ReactMarkdown>{post}</ReactMarkdown>
        </div>
    )
}