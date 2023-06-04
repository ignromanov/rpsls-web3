const storageKey = (chainId: string, contractAddress: string) =>
  `${chainId}-${contractAddress}`;

const isInLocalStorage = (
  chainId: string,
  contractAddress: string
): boolean => {
  return !!localStorage.getItem(storageKey(chainId, contractAddress));
};

const getFromLocalStorage = (
  chainId: string,
  contractAddress: string
): string | null => {
  return localStorage.getItem(storageKey(chainId, contractAddress));
};

const putToLocalStorage = (
  chainId: string,
  contractAddress: string,
  data: string
) => {
  localStorage.setItem(storageKey(chainId, contractAddress), data);
};

const removeFromLocalStorage = (chainId: string, contractAddress: string) => {
  localStorage.removeItem(storageKey(chainId, contractAddress));
};

export {
  isInLocalStorage,
  getFromLocalStorage,
  putToLocalStorage,
  removeFromLocalStorage,
};
