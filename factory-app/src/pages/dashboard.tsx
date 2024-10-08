import { useEffect, useState } from "react";
import { Parser } from 'html-to-react'


const rawHTML = `
<div>
  <p>The <strong>rat</strong> hates the <strong>cat</strong></p>
  <p><i>This is something special</i></p>
  <div>
    <img src="https://www.kindacode.com/wp-content/uploads/2021/06/cute-dog.jpeg"/>
  </div>
  <h1>H1</h1>
  <h2>H2</h2>
  <h3>H3</h3>
  <h4>Just Another Heading</h4>
</div>
`;

// https://www.kindacode.com/article/ways-to-render-html-content-in-react-and-jsx/#google_vignette

export default function Dashboard() {
    const [content, setContent] = useState('');

    useEffect(() => {
        setContent(rawHTML);
    }, [])

    return <>
        <p>dashboard works</p>
        <div>
            <button onClick={() => {
                // reset-pwd.html
                fetch('/resources/samples/verify-email.html').then(res => {
                    res.text().then(data => setContent(data));
                })
            }}>Use Template</button>
            {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
            {Parser().parse(content)}
        </div>
    </>
}