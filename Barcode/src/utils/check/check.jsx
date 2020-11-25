const Check = {
    Obj: obj => { return (Object.keys(obj).length !== 0 && obj.constructor === Object)? true: false },
    Arr: arr => { return (arr.length !== 0 && arr.constructor === Array)? true: false; }
}

export default Check
