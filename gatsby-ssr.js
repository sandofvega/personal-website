/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';

// Add Crisp chat widget
export const onRenderBody = ({ setHeadComponents }) => {
  const enableCrisp = process.env.GATSBY_ENABLE_CRISP === 'true';
  const crispId = process.env.GATSBY_CRISP_WEBSITE_ID;

  if (!enableCrisp || !crispId) {
    return;
  }

  setHeadComponents([
    <script
      key="crisp-chat"
      dangerouslySetInnerHTML={{
        __html: `
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="${process.env.GATSBY_CRISP_WEBSITE_ID}";
          (
            function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
            }
          )();
        `,
      }}
    />,
  ]);
};
