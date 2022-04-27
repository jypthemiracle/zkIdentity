import { readFile } from 'fs/promises';
import { buildPoseidon } from 'circomlibjs';

const poseidon = await buildPoseidon();

const NULL_NODE = -1;

const buildTree = async (winnerHexStrs) => {
    const winners = winnerHexStrs.map(s => Number(s));
    winners.sort((a, b) => a - b);

    let pathElements = Object.fromEntries(
        winners.map(w => [w, []])
    );

    let pathIndices = Object.fromEntries(
        winners.map(w => [w, []])
    );

    let nodeToLeaves = Object.fromEntries(
        winners.map(w => [w, [w]])
    );

    let curLevel = winners;

    while (curLevel.length > 1) {
        let newLevel = [];

        for (let i = 0; i < curLevel.length; i += 2) {

            let firstChild = curLevel[i];
            let secondChild;
            if (i === curLevel.length - 1) {
                secondChild = NULL_NODE;
            } else {
                secondChild = curLevel[i + 1];
            }

            let firstChildLeaves = nodeToLeaves[firstChild];
            let secondChildLeaves;
            if (secondChild === NULL_NODE) {
                secondChildLeaves = [];
            } else {
                secondChildLeaves = nodeToLeaves[secondChild];
            }

            for (const leaf of firstChildLeaves) {
                pathElements[leaf].push(secondChild);
                pathIndices[leaf].push(0);
            }

            for (const leaf of secondChildLeaves) {
                pathElements[leaf].push(firstChild);
                pathIndices[leaf].push(1);
            }

            let parent = poseidon([
                Number(firstChild),
                Number(secondChild)
            ]);

            nodeToLeaves[parent] = firstChildLeaves.concat(secondChildLeaves);
            newLevel.push(parent);
        }

        curLevel = newLevel;
    }

    return {
        root: curLevel[0],
        pathElements,
        pathIndices
    }
}

const getWinners = async() => {
    const r1Winners = JSON.parse(await readFile(new URL('./data/r1-winners.json', import.meta.url)))
    const r2Winners = JSON.parse(await readFile(new URL('./data/r2-winners.json', import.meta.url)))
    const r3Winners = JSON.parse(await readFile(new URL('./data/r3-winners.json', import.meta.url)))
    const r4Winners = JSON.parse(await readFile(new URL('./data/r4-winners.json', import.meta.url)))

    const allWinners = r1Winners.concat(r2Winners, r3Winners, r4Winners);

    return allWinners.map(w => w['winner']);
}

let winners = await getWinners();
let tree = await buildTree(winners);

console.log(tree['leafToPathElements'])