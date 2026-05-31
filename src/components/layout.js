import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Head, Loader, Nav, Social, Email, VirtualTwin, Footer } from '@components';
import { useIsDesktop } from '@hooks';
import { GlobalStyle, theme } from '@styles';

const AppShell = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const SiteColumn = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: var(--chat-panel-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const MobileShell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  const isHome = location.pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const isDesktop = useIsDesktop();

  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading]);

  const chrome = (
    <>
      <Nav isHome={isHome} />
      <Social isHome={isHome} />
      <Email isHome={isHome} />
    </>
  );

  const page = (
    <div id="content">
      {children}
      <Footer />
    </div>
  );

  return (
    <>
      <Head />

      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <a className="skip-to-content" href="#content">
            Skip to Content
          </a>

          {isLoading && isHome ? (
            <Loader finishLoading={() => setIsLoading(false)} />
          ) : isDesktop ? (
            <AppShell>
              <SiteColumn>
                {chrome}
                <StyledContent>{page}</StyledContent>
              </SiteColumn>
              <VirtualTwin />
            </AppShell>
          ) : (
            <MobileShell>
              {chrome}
              {page}
            </MobileShell>
          )}
        </ThemeProvider>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
