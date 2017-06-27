/* eslint-disable react/jsx-key */

import { h } from "preact";

import config from "../config";

export default ({ chunks, vendor, component, manifest, script, style, title, initialState }) =>
  <html lang={config.lang}>
    <head>
      <meta charSet="utf-8" />

      <title>{config.head.title}{title && ` | ${title}`}</title>

      <meta name="description" content={config.head.description} />

      {config.head.meta.map(m => <meta name={m.name} content={m.content} />)}

      {config.head.customMeta.map(m => <meta property={m.property} content={m.content} />)}

      {config.head.link.map(l =>
        <link color={l.color} href={l.href} rel={l.rel} sizes={l.sizes} type={l.type} />
      )}

      {chunks.map(c => <link rel="preload" as="script" href={`/${c}`} />)}

      <style id="css">{style}</style>
    </head>
    <body>
      <main dangerouslySetInnerHTML={{ __html: component }} />

      <script dangerouslySetInnerHTML={{ __html: initialState }} />

      <script src={`/${manifest}`} defer />
      <script src={`/${vendor}`} defer />
      <script src={`/${script}`} defer />
    </body>
  </html>;
