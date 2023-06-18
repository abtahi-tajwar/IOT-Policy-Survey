export const selectLowestRandomIndex = (arr : Array<number>) => {
    const distributionObj : any = {}
    let lowest : number = Infinity
    arr.forEach((item : number, index : number) => {
        if (item < lowest) lowest = item
        if (item in distributionObj) {
            distributionObj[item].push(index)
        } else {
            distributionObj[item] = [index]
        }
    })
    const randomIndex = Math.floor(Math.random() * 10) % distributionObj[lowest].length
    
    return distributionObj[lowest][randomIndex]
}
