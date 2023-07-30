const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);
    const signer1 = ethers.provider.getSigner(1);
    const address = await signer.getAddress();
    const address1 = await signer1.getAddress();

    return { game,signer,signer1,address,address1 };
  }
  it('should be a winner', async function () {
    const { game,signer,signer1,address,address1 } = await loadFixture(deployContractAndSetVariables);
    //         addr2
    // [addr1][msg.signer]=true
    // addr1
    // [msg.signer][addr2]=true

    // nested mappings are rough :}
    await game.connect(signer1).write(address);


    await game.connect(signer).win(address1);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
