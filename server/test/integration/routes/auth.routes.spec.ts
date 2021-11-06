import chai from "chai";
import sinon from "sinon";

let assert = chai.assert;
let should = chai.should();

class NumberReturner {
    returnThreeIfNotOdd(param: number) {
        if (param % 2 === 0) {
            return param;
        }
        return 3;
    }
}

let testingInstance = new NumberReturner();

describe('the trimTodoName function', function () {
    it('should return 3', function () {
        testingInstance.returnThreeIfNotOdd(1).should.equal(3);
    });
    it('should return 4', function () {
        testingInstance.returnThreeIfNotOdd(4).should.equal(4)
    });
    it('should return 16', function () {
        assert(testingInstance.returnThreeIfNotOdd(16) === 16, "Живем пацаны!");
    });
});