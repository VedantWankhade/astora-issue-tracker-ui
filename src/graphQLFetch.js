// regex of pattern ISOString
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

// function that will be passed to JSON.parse, will convert each string date into Date object
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

/**
 * Wrapper over api fetch, with error handling
 * @param query Api fetch query :string
 * @param variables graphQL variable
 * @returns {Promise<*>}
 */
export default async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    // if errors are encountered show them as alert
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    // if exception is found, then it must be api error
    alert(`Error in sending data to server: ${e.message}`);
  }
}
