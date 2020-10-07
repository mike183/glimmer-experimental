import { renderToString } from '@glimmerx/ssr';
import MyComponent from './src/MyComponent';

interface ExpressResponse {
  end(str: string): void;
}

export default async function handler(
  _: {},
  res: ExpressResponse,
  clientsideBundleLocation: string
) {
  const ssrOutput = await renderToString(MyComponent, {
    args: {
      count: 10,
    },
  });

  res.end(`
      <!doctype html>
      <html>
        <head>
          <title>Glimmer Demo</title>
        </head>
        <body>
          <div id="app">${ssrOutput}</div>
          <script src="${clientsideBundleLocation}"></script>
        </body>
      </html>
    `);
}
