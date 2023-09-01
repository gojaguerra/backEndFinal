const iniHome =  (req, res) => {
    res.render('home.handlebars', {
        user: req.user
    });
};

export {
    iniHome
};