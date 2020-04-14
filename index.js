// Thanks for the opportunity, and for taking the time to look at my code.
// Commits were made, so git history is available.

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Helper function to return array of variant domains from API request.
 * @param {Request} request 
 */
async function getVariants(request) {
  // Perform a request on the API and parse the response JSON object
  const res = await fetch("https://cfw-takehome.developers.workers.dev/api/variants");
  const resJSON = await res.json();
  const { variants } = resJSON;

  // Extract and return the variant URLs
  return Object.values(variants);
}

/**
 * Handle requests to the page and return a response.
 * @param {Request} request
 */
async function handleRequest(request) {

  // Try to grab a cookie on the request header.
  const cookie = request.headers.get('cookie');
  const ID = "saved-response";

  // Retrieve the domain variants and pick a random one (Math.random() should be random enough for our purposes)
  const variants = await getVariants(request);
  const choice = Math.random() < 0.5 ? 0:1;
  const randomDomain = variants[choice];
  const cookieValue = choice === 0 ? 'first':'second';

  // Check if the cookie exists. If it does, try to form a response based on the cookie value
  if(cookie) {
    if(cookie.includes(`${ID}=first`)) {
      return await prepareResponse(variants[0], 1)
    } else if(cookie.includes(`${ID}=second`)) {
      return await prepareResponse(variants[1], 2)
    }
  }

  // If there is no cookie, then set one for next time
  const response = await prepareResponse(randomDomain, choice+1);
  response.headers.append('Set-Cookie', `${ID}=${cookieValue}; path=/`);

  // Return the response
  return response;
}

/**
 * This function takes a domain and variant number, and forms a customized response.
 * I chose to make every tag handler a seperate class in order to maintain modularity.
 * @param {String} domain 
 * @param {Number} variantNumber 
 */
async function prepareResponse(domain, variantNumber) { 
  // Declare tag handler classes with custom behaviour.
  class TitleHandler {
    element(element) {
      element.setInnerContent(variantNumber == 1 ? "First Page :)":"Second Page :)");
    }
  }
  class HeaderHandler {
    element(element) {
      element.setInnerContent(`Hey Cloudflare team! This is Variant ${variantNumber}.`);
    }
  }
  class DescriptionHandler {
    element(element) {
      element.setAttribute("style", "color: purple; font-weight: 600");
      element.setInnerContent(`Thanks for testing the program, your cookie is saved for this page! :)`);
    }
  }
  class LinkHandler {
    element(element) {
      element.setInnerContent(`Click here to visit my GitHub!`);
      element.setAttribute("href", "https://github.com/amirafzali");
    }
  }

  // Listen for certain tags and use the appropriate handler in each case.
  const res = await fetch(domain);
  return new HTMLRewriter()
            .on('title', new TitleHandler())
            .on('h1#title', new HeaderHandler())
            .on('p#description', new DescriptionHandler())
            .on('a#url', new LinkHandler())
          .transform(res);
}