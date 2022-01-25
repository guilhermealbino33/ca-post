const log = (message: string) => {
  const date = Date.now();

  console.log(`[${date}] ${message}`);
};

export { log };
