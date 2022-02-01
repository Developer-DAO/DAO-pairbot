/**
 * Author: Aiden Montgomery 
 * Taken from: https://github.com/Developer-DAO/devie-bot
 **/

function sanitiseGithubHandle(handle: string): string {
    let clean = handle.trim();
    // Remove any trailing '/'s
    if (clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }
  
    // Remove any URL Parameters
    while (clean.lastIndexOf('?') > 0) {
      clean = clean.slice(0, clean.lastIndexOf('?'));
    }
  
    // Remove everyhing part from the last part of the URL
    if (clean.lastIndexOf('/') > 0) {
      clean = clean.slice(clean.lastIndexOf('/') + 1);
    }
  
    // Remove any characters remaining that are not valid in a twitter handle (including the '@')
    return clean.replace(/\W/g, '');
}
  
function validGithubUser(username: string): boolean {
	return  /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username);
}

export function validateGithubHandle(input: string) {
    const cleanHandle = sanitiseGithubHandle(input);
    const validHandle = validGithubUser(cleanHandle);

    if (validHandle) {
        return cleanHandle;
    } else {
        return false;
    }
}