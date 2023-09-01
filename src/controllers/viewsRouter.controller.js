const homeRoot =  (req, res) => {
    res.render('home.handlebars', {
        user: req.user
    });
};

const registerRoot = (req, res) => {
    res.render('register.handlebars');
};

const loginRoot =(req, res) => {
    res.render('login.handlebars');
};

const resetRoot =(req, res) => {
    res.render('resetPassword.handlebars');
};

const resetRootError =(req, res) => {
    res.render('resetPasswordError.handlebars');
};

const profileRoot =(req, res) => {
    res.render('profile.handlebars', {
        user: req.user,
    });
};

export {
    homeRoot,
    registerRoot,
    loginRoot,
    profileRoot,
    resetRoot,
    resetRootError
};