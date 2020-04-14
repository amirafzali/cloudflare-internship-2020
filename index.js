addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Helper function to return array of domains from API request
 * @param {Request} request 
 */
async function getDomains(request) {

  // Perform a GET request on the API and parse the returned JSON object.
  const request = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");
  const requestJSON = await request.json();

  // Extract the URL values and pick a random one
  return Object.values(requestJSON);

}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const options = await getDomains(request);

  const selectedDomain = Math.random < 0.5 ? options[0]:options[1];

  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}
