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


	  const transfertokenTx = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData("transfer", ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1",hre.ethers.parseUnits("1",18)]), 0);
	  await transfertokenTx.wait();

	  console.log("Transaction Receipt: ", transfertokenTx);

}

main().catch((error) => {
	  console.error(error);
	  process.exitCode = 1;
});


