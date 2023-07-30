const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  var winner;
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signers = await ethers.getSigners();
    const winner = await getWinner(signers[0]);

    return { game ,winner};
  }

  async function getWinner(signer) {
    var threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    while (!winner) {
      // create random addresses until the address that has value less than the threshold is found.
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();

      if (address < threshold) {
        // send the address 1 ether to ensure that it has some funds to call the win function.

        await signer.sendTransaction({
          value: ethers.utils.parseEther("1.0"),
          to: address
        })

        winner = wallet;
      }
    }

    return winner;
  }

  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck

    await game.connect(winner).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
