export const convertToFirestoreData = (data : any, isParentArray = false) : any => {
    if (data instanceof Array) {
        if (isParentArray) {
            return {
                _: data.map(item => convertToFirestoreData(item))
            }
        } else {
            return data.map(item => convertToFirestoreData(item, true))
        }
    } else if (data instanceof Object) {
        const newObj : any = {}
        Object.keys(data).forEach(key => {
            newObj[key] = convertToFirestoreData(data[key])
        })
        return newObj
    } else {
        return data
    }
}
export const convertFromFirestoreData = (data : any, isParentArray = false) : any=> {
    if (data instanceof Array) {
        return data.map(item => convertFromFirestoreData(item, true))
    } else if (data instanceof Object) {
        if (isParentArray && Object.keys(data).length === 1 && Object.keys(data)[0] === '_') {
            return [ ...data['_'] ]
        } else {
            const newObj : any = {}
            Object.keys(data).forEach(key => {
                newObj[key] = convertFromFirestoreData(data[key])
            })
            return newObj
        }
    } else {
        return data
    }
}