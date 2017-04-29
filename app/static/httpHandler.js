const fs = require('fs')

module.exports = (req, res) => {
  console.log('static request!')
  fs.readFile(`${__dirname}/index.html`, (err, data) => {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading index.html')
    }

    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200)
    res.end(data)
  })
}
