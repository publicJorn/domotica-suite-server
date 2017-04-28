const fs = require('fs')

module.exports = (req, res) => {
  fs.readFile(`${__dirname}/index.html`, (err, data) => {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading index.html')
    }

    res.writeHead(200)
    res.end(data)
  })
}
