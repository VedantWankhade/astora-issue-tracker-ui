export default function template(body) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="index.css" />
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" />
    <title>Astora Issue Tracker</title>
  </head>

  <body>
    <div id="contents">${body}</div>
  </body>
</html>
    `;
}
