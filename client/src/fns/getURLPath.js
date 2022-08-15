const getFrontURL =  (subDomain) => {
  const currentURLOrigin = window.location.origin;
  const currentSubDomain = subDomain ? subDomain : "";

  return currentURLOrigin + currentSubDomain;
};

export {getFrontURL};
