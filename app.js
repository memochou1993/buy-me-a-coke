if (typeof window.ethereum !== 'undefined') {
  console.log('MetaMask is installed!');
}

const button = document.querySelector('button');

button.addEventListener('click', async () => {
  const [from] = await ethereum.request({
    method: 'eth_requestAccounts',
  });
  const to = '0x31B98D14007bDEe637298086988A0bBd31184523';
  try {
    const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to,
          gas: (30000).toString(16),
          gasPrice: (1500000000).toString(16),
          value: (1000000000000000).toString(16),
        },
      ],
    });
    console.log(txHash);
  } catch {
    //
  }
});
