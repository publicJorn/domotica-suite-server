const timeout = function (delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

const timer = async () => {
  console.log('timer started')
  await timeout(1000)
  console.log('timer finished')
}

timer()
