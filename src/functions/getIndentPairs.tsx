function isStartBlock(block){
    const name =  block.name.toLowerCase()
    if(name.startsWith('conditional ') || name.startsWith('repeat ')){
        return true
    } 
    return false
}

function isEndBlock(block){
    const name =  block.name.toLowerCase()
    if(name.startsWith('end ') || block.values.length == 0){
        return true
    } 
    return false
}

export default function getIndentPairs(blocks:[]){

    const stack = [];
    const result = [];
    const flatResult = [];
    let lastClosedIndex = -1;

    blocks.forEach((item, index) => {
        if (isStartBlock(item)) {
            const block = { start: index, end: null, interior: [] };
            if (stack.length === 0 || lastClosedIndex === stack[stack.length - 1].end) {
                result.push(block);
            } else {
                stack[stack.length - 1].interior.push(block);
            }
            stack.push(block);
        } else if (isEndBlock(item) && stack.length > 0) {
            const lastBlock = stack.pop();
            lastBlock.end = index;
            flatResult.push({ start: lastBlock.start, end: lastBlock.end });
            lastClosedIndex = index;
        }
    });

    console.log(result);
    return [result, flatResult];
}