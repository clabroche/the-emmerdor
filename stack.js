let BASE 
BASE = "emmerdor"

const stack = [
  {
    label: 'emmerdor-server',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'server'],
    spawnOptions: {
      cwd:  __dirname,
      env: Object.assign({
        PORT: '4876',
      }, process.env)
    }
  },
  {
    label: 'emmerdor-front',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'front'],
    spawnOptions: {
      cwd: __dirname,
      env: Object.assign({
        VUE_APP_SERVER_URL: 'http://localhost:4876',
      }, process.env)
    }
  },
]

module.exports = stack
