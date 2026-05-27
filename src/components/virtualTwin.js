import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';
import { IconLogo, IconHex } from '@components/icons';

const DEFAULT_MESSAGE =
  "Hello! I'm Yasin's Virtual Twin. Ask me anything about his work!";

const MAX_HISTORY_PAIRS = 10;

const StyledPanel = styled.aside`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-self: flex-start;
  position: sticky;
  top: 0;
  width: var(--chat-panel-width);
  height: 100vh;
  border-left: 1px solid var(--green);
  background-color: var(--navy);
`;

const StyledHeader = styled.div`
  flex-shrink: 0;
  padding: 20px 16px;
  border-bottom: 1px solid var(--lightest-navy);
  text-align: center;

  h2 {
    margin: 0;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-lg);
    font-weight: 600;
    letter-spacing: 0.05em;
  }
`;

const StyledMessages = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledMessageRow = styled.div`
  display: flex;
  justify-content: ${props => (props.$isHuman ? 'flex-end' : 'flex-start')};
  align-items: flex-start;
  gap: 8px;
`;

const StyledAvatar = styled.div`
  flex-shrink: 0;
  position: relative;
  width: 28px;
  height: 28px;
  color: var(--green);

  svg {
    width: 100%;
    height: 100%;
  }

  .hex-container {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .logo-container {
    position: relative;
    z-index: 1;

    svg {
      fill: none;

      polygon {
        fill: var(--navy);
      }
    }
  }
`;

const StyledBubble = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  font-family: var(--font-sans);
  font-size: var(--fz-md);
  line-height: 1.5;
  white-space: pre-line;

  ${props =>
    props.$isHuman
      ? `
    background-color: var(--green);
    color: var(--navy);
  `
      : `
    background-color: var(--light-navy);
    color: var(--green);
  `}
`;

const StyledForm = styled.form`
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--lightest-navy);
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  min-height: 80px;
  max-height: 160px;
  padding: 12px 14px;
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  background-color: var(--light-navy);
  color: var(--lightest-slate);
  font-family: var(--font-sans);
  font-size: var(--fz-md);
  line-height: 1.5;
  resize: vertical;
  transition: var(--transition);

  &::placeholder {
    color: var(--slate);
  }

  &:focus {
    outline: none;
    border-color: var(--green);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const StyledSendButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: var(--border-radius);
  background-color: var(--green);
  color: var(--navy);
  cursor: pointer;
  transition: var(--transition);

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    background-color: var(--green);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const VirtualTwin = () => {
  const [messages, setMessages] = useState([{ role: 'ai', text: DEFAULT_MESSAGE }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const wasLoadingRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const aiHost = process.env.GATSBY_AI_HOST;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [messages, isLoading, prefersReducedMotion]);

  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      inputRef.current?.focus();
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const handleSubmit = async e => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (!aiHost) {
      setMessages(prev => [
        ...prev,
        { role: 'human', text: trimmed },
        { role: 'ai', text: 'Chat is not configured. Please try again later.' },
      ]);
      setInput('');
      inputRef.current?.focus();
      return;
    }

    const userMessage = trimmed;
    setInput('');

    const conversationMessages = messages.slice(1);
    const history = conversationMessages.slice(-(MAX_HISTORY_PAIRS * 2));

    setMessages(prev => [...prev, { role: 'human', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${aiHost}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });
      const data = await res.json();
      const reply = res.ok && data.reply ? data.reply : 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const AiAvatar = (
    <StyledAvatar aria-hidden="true">
      <div className="hex-container">
        <IconHex />
      </div>
      <div className="logo-container">
        <IconLogo />
      </div>
    </StyledAvatar>
  );

  return (
    <StyledPanel aria-label="Virtual Twin chat">
      <StyledHeader>
        <h2>Virtual Twin</h2>
      </StyledHeader>

      <StyledMessages>
        {messages.map((msg, i) => {
          const isHuman = msg.role === 'human';
          return (
            <StyledMessageRow key={i} $isHuman={isHuman}>
              {!isHuman && AiAvatar}
              <StyledBubble $isHuman={isHuman}>{msg.text}</StyledBubble>
            </StyledMessageRow>
          );
        })}
        {isLoading && (
          <StyledMessageRow $isHuman={false}>
            {AiAvatar}
            <StyledBubble $isHuman={false}>...</StyledBubble>
          </StyledMessageRow>
        )}
        <div ref={chatEndRef} />
      </StyledMessages>

      <StyledForm onSubmit={handleSubmit}>
        <StyledTextarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={3}
          aria-label="Type your message"
        />
        <StyledSendButton type="submit" disabled={isLoading} aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </StyledSendButton>
      </StyledForm>
    </StyledPanel>
  );
};

export default VirtualTwin;
