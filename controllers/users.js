module.exports.getRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.postRegister = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registedUser = await User.register(user, password);
        req.login(registedUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Planet Feedback!');
            res.redirect('/earthExplorer');
        });
    }
    catch (e) {
        req.flash('error', 'User already exists!');
        res.redirect('/register');
    }
}

module.exports.getLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/earthExplorer';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/earthExplorer');
    });
}