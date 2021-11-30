const readline = require("readline");

let DB = {}
const TRANSACTION = []
let temp
let index = -1
let transactionMode = false

function runDB() {
      const rl = readline.createInterface(process.stdin, process.stdout)
      rl.setPrompt('ready> ')
      rl.prompt();
      rl.on('line', (line) => {
        const values = line.split(' ')
        switch(true) {
            case line.toLowerCase().startsWith('set'):
                
                if(values.length !== 3) {
                    console.log('Incorrect number of params')
                    break
                }
                const [, name, value] = values
                if(transactionMode) {
                    temp[name] = value
                    TRANSACTION[index] = temp
                    break
                }
                DB[name] = value
                break
            case line.toLowerCase().startsWith('get'):

                if(values.length !== 2) {
                    console.log('Incorrect number of params')
                    break
                }
                if(transactionMode) {
                    console.log(temp[values[1]] || null)
                    break
                }
                console.log(DB[values[1]] || null)
                break
            case line.toLowerCase().startsWith('delete'):
                if(values.length !== 2) {
                    console.log('Incorrect number of params')
                    break
                }
                if(transactionMode) {
                    delete temp[values[1]]
                }
                delete DB[values[1]]
                break
            case line.toLowerCase().startsWith('count'):
                if(values.length !== 2) {
                    console.log('Incorrect number of params')
                    break
                }

                if(transactionMode) {
                    const result = Object.values(temp).filter(item => item === values[1])
                    console.log(result.length || 0)
                    break
                }

                const result = Object.values(DB).filter(item => item === values[1])
                console.log(result.length || 0)
                break
            case line.toLowerCase() === 'end':
                rl.close()
                break
            case line.toLowerCase().startsWith('begin'):
                if(values.length !== 1) {
                    console.log('Incorrect number of params')
                    break
                }
                index++
                transactionMode = true;
                temp = {...DB, ...temp}
                break
            case line.toLowerCase().startsWith('rollback'):
                index--
                temp = {...TRANSACTION[index]}
                console.log(temp)
                break
            case line.toLowerCase().startsWith('commit'):
                DB = {...temp}
                transactionMode = false;
                break
            default: 
                console.log(`unknown command: "${line}"`)
        }
        rl.prompt()
      }).on('close',() => {
        process.exit(0) // this is the final result of the function
      });
  }

  runDB()