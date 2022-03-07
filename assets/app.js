const BASE_AMOUNT = 100;
const MIN_COUNT = 1;
const MAX_COUNT = 100;

class Envoy {
  avatar = document.getElementById('avatar');
  username = document.getElementById('username');
  rate = document.getElementById('rate');
  minusButton = document.getElementById('minus');
  countInput = document.getElementById('count');
  plusButton = document.getElementById('plus');
  donateButton = document.getElementById('donate');

  currency = 'TWD';
  rates = [];
  count = 1;
  value = 0;

  constructor() {
    this.init();
    this.minusButton.addEventListener('click', () => this.onMinusButtonClick());
    this.countInput.addEventListener('input', (e) => this.onCountInputChange(e));
    this.plusButton.addEventListener('click', () => this.onPlusButtonClick());
    this.donateButton.addEventListener('click', () => this.onDonateButtonClick());
  }

  async init() {
    if (window.location.host.includes('.github.io')) {
      const subject = window.location.host.replace('.github.io', '');
      this.avatar.src = `https://github.com/${subject}.png`;
      this.avatar.alt = subject;
      this.username.textContent = subject;
    }
    this.rates = await this.fetchRates();
    this.calculate();
  }

  calculate() {
    this.value = Math.round((BASE_AMOUNT * this.count / Number(this.rates[this.currency]) * Math.pow(10, 18)));
    rate.textContent = `${(BASE_AMOUNT * this.count).toLocaleString()} ${this.currency} ≈ ${(this.value / Math.pow(10, 18)).toFixed(9)} ETH`;
  }

  reset() {
    this.count = MIN_COUNT;
    this.value = 0;
    this.countInput.value = MIN_COUNT;
    this.calculate();
  }

  fetchRates() {
    return new Promise((resolve, reject) => {
      fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
      .then((r) => r.json())
      .then(({ data }) => resolve(data.rates))
      .catch((err) => reject(err));
    });
  }

  onMinusButtonClick() {
    if (this.count > MIN_COUNT) {
      this.count -= 1;
      this.countInput.value = this.count;
      this.calculate();
    }
  }

  onCountInputChange(e) {
    const count = Number(e.target.value);
    if (count > MAX_COUNT) {
      this.countInput.value = MAX_COUNT;
      return;
    }
    if (count < MIN_COUNT) {
      this.countInput.value = MIN_COUNT;
      return;
    }
    this.count = count;
    this.calculate();
  }

  onPlusButtonClick() {
    if (this.count < MAX_COUNT) {
      this.count += 1;
      this.countInput.value = this.count;
      this.calculate();
    }
  }

  async onDonateButtonClick() {
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
            value: this.value.toString(16),
          },
        ],
      });
      this.reset();
      console.log(txHash);
    } catch (err) {
      console.log(err);
    }
  }
}

if (typeof window.ethereum !== 'undefined') {
  new Envoy();
}
