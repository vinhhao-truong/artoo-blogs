const getFrontURL =  (subDomain) => {
  const currentURLOrigin = window.location.origin;
  const currentSubDomain = subDomain ? subDomain : "";

  return currentURLOrigin + currentSubDomain;
};

const getBackURL = (subDomain) => {
  const currentProtocol = window.location.protocol;
  const currentHostName =window.location.hostname;
  return `${currentProtocol}//${currentHostName}:3001${subDomain}`;
}

export {getFrontURL, getBackURL};
