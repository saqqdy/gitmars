export default function (path = '/app') {
    return function (req, res) {
        res.redirect(path)
    }
}
