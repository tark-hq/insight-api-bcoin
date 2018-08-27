class SpentOutput {
    constructor(inputIndex, mtx) {
        this.inputIndex = inputIndex;
        this.mtx = mtx;
        this.tx = mtx.tx;
    }
}

module.exports = SpentOutput;