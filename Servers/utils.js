const checkLogin = (req)=>{
    return req.session.username != null;
}

module.exports = checkLogin;