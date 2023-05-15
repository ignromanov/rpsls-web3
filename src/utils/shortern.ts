const shortenAddress = (address: string | null | undefined) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
};

export { shortenAddress };
