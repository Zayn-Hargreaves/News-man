const convertDateTime = (timestamp)=>{
    const data = new Date(timestamp)
    return data.toLocaleString()
}

export {convertDateTime}