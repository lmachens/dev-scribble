import React from "react";
import { Global, css } from "@emotion/react";

function GlobalStyles() {
  return (
    <Global
      styles={css`
        @import url(https://cdn.jsdelivr.net/gh/tonsky/FiraCode@3/distr/fira_code.css);

        *,
        *::after,
        *::before {
          box-sizing: border-box;
        }

        html {
          font-size: 16px;
        }

        body {
          margin: 0;
          font-family: "Fira Code", monospace;
          background: black;
          color: #ddd;
        }

        h1,
        h2,
        h3 {
          font-family: "Fira Code", monospace;
        }
      `}
    />
  );
}

export default GlobalStyles;
