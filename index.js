addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Helper function to return array of variant domains from API request
 * @param {Request} request 
 */
async function getVariants(request) {
  // Perform a GET request on the API and parse the returned JSON object.
  const res = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");
  const resJSON = await res.json();
  const { variants } = resJSON;

  // Extract and return the variant URLs
  return Object.values(variants);
}

async function prepareResponse(domain, variantNumber) {

}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const returnInfo = { headers: { 'content-type': 'text/html;charset=UTF-8' } };

  // Try to grab a cookie on the request header
  const cookie = request.headers.get('cookie');
  const ID = "saved-response";

  // Retrieve the domain options and pick a random one (should be random enough for our purposes)
  const variants = await getVariants(request);
  const choice = Math.random() < 0.5 ? 0:1;
  const randomDomain = variants[choice];
  const cookieValue = choice === 1 ? 'first':'second';

  // Check if the cookie exists
  if(cookie) {
    if(cookie.includes(`${ID}=first`)) {
      return new Response(formFirst());
    } else if(cookie.includes(`${ID}=second`)) {
      return new Response(f);
    }
  }

  // Remember the decision for next time.
  //response.headers.append('Set-Cookie', `${ID}=${cookieValue}; path=/`);
  const res = await fetch(randomDomain);  
  console.log(randomDomain);
  return new Response(await res.text(), returnInfo);
}
