const dev = {
    app:{
        port:3000
    },
    // db:{
    //     host:'localhost',
    //     port:27017,
    //     name:'dbDev'
    // }
    db:{
        cockroachUrl:process.env.db_url
    }
}
const pro = {
    app:{
        port:3000
    },
    // db:{
    //     host:'localhost',
    //     port:27017,
    //     name:'dbProduct'
    // }
    db:{
        cockroachUrl:process.env.db_url
    }
}
const config = {dev, pro};
const env = process.env.NODE_ENV||"dev";
module.exports = config[env]