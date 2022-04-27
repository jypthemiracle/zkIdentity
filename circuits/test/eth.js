const path = require("path");
const chai = require("chai");
const circom_tester = require("circom_tester");
const ethers = require("ethers");
const utils = require("./utils");
const fs = require("fs");

const assert = chai.assert;
const wasm_tester = circom_tester.wasm;

const numToBits = (num, numBits) => {
  const bits = (num >>> 0).toString(2);
  const padding = numBits - bits.length;
  const paddedBits = padding > 0 ? bits.padStart(numBits, 0) : bits;

  if (numBits < bits.length) {
    throw new Error("Not enough bits");
  }

  return paddedBits.split("");
};

const flattenPubKey = (x, y, n) => {
  // flatten x and y into a single bit array.
  const xBitArray = x.map((num) => numToBits(num, n).reverse());
  const yBitArray = y.map((num) => numToBits(num, n).reverse());

  // flatten bit arrays and concatenate
  const bitArray = [
    ...xBitArray.flat().slice(0, 256),
    ...yBitArray.flat().slice(0, 256),
  ];

  console.log("bitArray length: ", bitArray.length, "\n", bitArray);

  return bitArray;
};

describe("Flatten PubKey Tests", function () {
  this.timeout(100000);

  it("flattens properly when pubkey is a perfect fit in registers", async () => {
    const circuit = await wasm_tester(
      path.join(__dirname, "circuits", "flatten_key_64_4.circom")
    );
    await circuit.loadConstraints();

    const inX = [100, 27, 32, 144];
    const inY = [200, 31, 42, 1];

    const expectedOut = flattenPubKey(inX, inY, 64);

    const witness = await circuit.calculateWitness({
      chunkedPubkey: [inX, inY],
    });
    await circuit.checkConstraints(witness)

    witness.shift();

    assert.deepEqual(witness.join(""), expectedOut.join(""));
  });

  it("flattens properly when there is 'extra space' in the last register", async function () {
    const circuit = await wasm_tester(
      path.join(__dirname, "circuits", "flatten_key_86_3.circom")
    );
    await circuit.loadConstraints();

    const inX = [100, 27, 27];
    const inY = [27, 27, 42];

    const expectedOut = flattenPubKey(inX, inY, 86);

    const witness = await circuit.calculateWitness({
      chunkedPubkey: [inX, inY],
    });
    await circuit.checkConstraints(witness)
    const output = witness.slice(1, 513);

    let data = JSON.stringify(output);
    fs.writeFileSync('flattenpubkey.json', data);
    assert.deepEqual(output.join(""), expectedOut.join(""));
  });
});

describe('Public Key to Address', function() {
  this.timeout(100000);

  it('turns a flat public key into an address', async function () {
    const circuit = await wasm_tester(
        path.join(__dirname, 'circuits', 'pubkey_to_address.circom')
    );

    const witness = await circuit.calculateWitness({
      pubkeyBits: [
        '0',
        '0',
        '1',
        '0',
        '0',
        '1',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '1',
        '1',
        '0',
        '1',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '1',
        '1',
        '0',
        '1',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '1',
        '1',
        '0',
        '1',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '1',
        '1',
        '0',
        '1',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '1',
        '0',
        '1',
        '0',
        '1',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
        '0',
      ],
    })

    await circuit.checkConstraints(witness);

    const addressFromCircuit = ethers.BigNumber.from(witness[1]).toHexString();

    assert.deepEqual(
        ethers.utils.getAddress(addressFromCircuit),
        '0x5408e6A36E9911a8C0097bb1BD23bA4e39cCFF55'
    );

    console.log('address', ethers.BigNumber.from(witness[1]).toHexString())
    let data = JSON.stringify(witness);
  });
});

