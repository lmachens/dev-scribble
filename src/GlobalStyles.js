import React from "react";
import { Global, css } from "@emotion/core";

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

        a {
          text-decoration: none;
          color: inherit;
        }

        h1,
        h2,
        h3 {
          font-family: "Fira Code", monospace;
        }

        button,
        .button {
          display: inline-block;
          cursor: pointer;
          margin-top: 24px;
          color: #ddd;
          background: none;
          border: 1px solid #2f363d;
          padding: 10px 14px;
          font-size: 1.2rem;
          transition: 0.5s;
          text-decoration: none;
          font-family: "Fira Code", monospace;
        }

        button:hover,
        .button:hover {
          color: #ddd;
          background: #2f363d;
        }

        button:disabled,
        .button:disabled {
          color: #2f363d;
          border-color: transparent;
        }
      `}
    />
  );
}

export default GlobalStyles;
