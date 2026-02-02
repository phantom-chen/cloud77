import { ChangeEvent, FormEvent, useState } from "react";
import './UnderBuild.css';

export interface UnderBuildProps {
    background: {
        image: string,
        color?: string,
        textColor: string,
        style?: object,
        overlay: {
            color: string,
            opacity: string
        }
    },
    title: {
        text: string,
        style?: object
    },
    description: {
        text: string,
        style?: object
    },
    logo: {
        src: string,
        alt: string,
        style?: object
    },
    subscribe: {
        placeholder: string,
        buttonText: string,
        onSubmit: (value: string) => void,
        inputStyle?: object,
        buttonStyle?: object
    },
    links: {
        url: string,
        image: string,
        text?: string,
        imageStyle?: object,
        textStyle?: object
    }[]
}

export function UnderBuild(props: UnderBuildProps) {
    const { background, title, description, logo, subscribe, links } = props;
    const [inputValue, setInputValue] = useState('');

    return (
        <div
            className="UnderConstruction"
            style={{
                backgroundImage: `url(${background.image})`,
                backgroundColor: background.color,
                color: background.textColor,
                ...background.style
            }}
        >
            {background.overlay && background.overlay.color &&
                <div
                    style={{
                        backgroundColor: background.overlay.color,
                        opacity: background.overlay.opacity,
                    }}
                    className="UnderConstruction-overlay"
                />}

            <div className="UnderConstruction-container">
                {logo.src &&
                    <div className="UnderConstruction-logo-container">
                        <img
                            className="UnderConstruction-logo"
                            alt={logo.alt}
                            src={logo.src}
                            style={{ ...logo.style }}
                        />
                    </div>}

                {title.text &&
                    <div
                        className="UnderConstruction-title"
                        style={{ ...title.style }}
                    >
                        {title.text}
                    </div>}

                {description.text &&
                    <div
                        className="UnderConstruction-description"
                        style={{ ...description.style }}
                    >
                        {description.text}
                    </div>}

                {subscribe.onSubmit &&
                    <div className="UnderConstruction-notify">
                        <form onSubmit={(event: FormEvent<HTMLFormElement>) => {
                            event.preventDefault();

                            if (inputValue) {
                                subscribe.onSubmit(inputValue);
                                setInputValue('');
                            }
                        }}>
                            <input
                                className="UnderConstruction-input"
                                type="text"
                                placeholder={subscribe.placeholder}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => { setInputValue(event.target.value); }}
                                style={{ ...subscribe.inputStyle }}
                                value={inputValue}
                            />
                            <button
                                style={{ ...subscribe.buttonStyle }}
                                className="UnderConstruction-notify-button"
                                type="submit"
                            >
                                {subscribe.buttonText || 'Submit'}
                            </button>
                        </form>
                    </div>}
            </div>

            {links && links.length > 0 &&
                <div className="UnderConstruction-social-networks">
                    {links.map((social, i) => (
                        <a
                            className="UnderConstruction-social-networks-link"
                            key={i}
                            target='_blank'
                            rel="noopener noreferrer"
                            href={social.url}
                        >
                            {social.image &&
                                <img
                                    className="UnderConstruction-social-networks-image"
                                    src={social.image}
                                    alt={social.text}
                                    style={{ ...social.imageStyle }}
                                />}
                            {social.text &&
                                <span
                                    className="UnderConstruction-social-networks-text"
                                    style={{ ...social.textStyle }}
                                >
                                    {social.text}
                                </span>}
                        </a>
                    ))}
                </div>}
        </div>
    )
}

export default function UnderConstruction() {
    return <UnderBuild
        background={{
            image: 'https://static.pexels.com/photos/259698/pexels-photo-259698.jpeg',
            textColor: '#fff',
            overlay: {
                color: '#000',
                opacity: '.5'
            }
        }}
        logo={{
            src: 'https://image.ibb.co/b7guP5/Rubbby_without_text.png',
            alt: 'alt text'
        }}
        title={{
            text: 'Rubbby'
        }}
        description={{
            text: 'Our website is under construction. We\'ll be here soon, subscribe to be notified',
            style: {
                maxWidth: '440px',
            }
        }}
        subscribe={{
            placeholder: 'Enter your email',
            buttonText: 'Subscribe',
            onSubmit: (value) => {
                console.log('user typed email :', value);
            }
        }}
        links={[
            {
                url: 'https://www.facebook.com/',
                image: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png',
            },
            {
                url: 'https://www.twitter.com/',
                image: 'https://image.flaticon.com/icons/svg/145/145812.svg',
            },
            {
                url: 'https://www.linkedin.com/',
                image: 'https://image.flaticon.com/icons/svg/145/145807.svg',
            },
            {
                url: 'mailto:someone@example.com',
                image: 'https://image.flaticon.com/icons/svg/321/321817.svg',
            },
        ]}
    />
}
