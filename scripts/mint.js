const hre = require("hardhat");

const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {

  const rpclink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpclink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {

  const contractAddress = "0x4f281b439aeF3521dE71b46EFfa268Ec824A3895";

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("TechnoBabble");
  const contract = contractFactory.attach(contractAddress);

 const amount = hre.ethers.parseUnits("100",18);	

  const mint100tokensTx = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData("mint", [signer.address,amount]), 0);
  await mint100tokensTx.wait();

  console.log("Transaction Receipt: ", mint100tokensTx);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

