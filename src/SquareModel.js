let GLOBAL_ID = 0;

class SquareModel {
        constructor(index,value) {
            this.index = index;
            this.value = value;
            this.id = GLOBAL_ID++;
            this.toDelete = false;
        }
}

export default SquareModel;