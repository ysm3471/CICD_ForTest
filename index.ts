const convertPhoneNumber = (number: string) => {
    let result = '';
    if (number.length === 11) {
        result = number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else {
        if (number.length === 10 && number.indexOf('02') === 0) {
            result = number.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
        } else {
            result = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
    }
    return result !== "" ? result : number;
};

function checkNum(val: string) {
    const regex = /[^0-9]/g;
    const result = val.replace(regex, "");
    return result
}

function addNum(a: number, b: number) {
    return a + b;
}

function addNum2(a: number, b: number) {
    return a - b
}

export { addNum, addNum2, checkNum, convertPhoneNumber }