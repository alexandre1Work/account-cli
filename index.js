//modulos externos
import inquirer from 'inquirer';
import chalk from 'chalk';
//modulos internos
import fs from 'fs';
import { verify } from 'crypto';
import { parse } from 'url';

operation()

//MENU
function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar conta', 'Consultar saldo', 'Depositar', 'Sacar', 'Sair']
        }
    ]).then((resposta) => {

        const action = resposta['action'];
        
        if (action === 'Criar conta') {
            createAccount()
        } else if ( action === 'Consultar saldo') {
            getAccountBalance()
        } else if ( action === 'Depositar') {
            depostit()
        } else if ( action === 'Sacar') {
            withDraw()
        } else if ( action === 'Sair') {
            console.log((chalk.bgBlue.black('Obrigado por usar o nosso sistema!')))
            process.exit()
        }

    }).catch((err) => {

        console.log(err);

    })
}

//INTERFACE CRIAR CONTA
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

    buildAccount();
}

//CRIAR CONTA
function buildAccount() {

    inquirer.prompt([
        {
        name: 'accountName',
        message: 'Digite um nome para a sua conta: '
        },
    ]).then((resposta) => {
        
        //retira o nome da conta do objeto enviado pela função
        const accountName = resposta['accountName']
        console.info(accountName) //exibe o nome da conta 

        //verifica se existe o diretorio (banco de dados)
        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        //verifica se já existe uma conta com este nome, para criar
        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'));
            buildAccount();
            return
        }

        //cria a conta 
        fs.writeFile(`accounts/${accountName}.json`, '{"balance": 0}', (err) => {
            if (err) {
                console.log(chalk.bgRed.black('Erro ao criar a conta!'), err);
            } else {
                console.log(chalk.bgBlue.black('Conta criada com sucesso!'));
                operation();
            }
        });
        
        
    }).catch((err) => {
        console.log(err)
    })

}

//DEPOSITAR
function depostit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta? '
        }
    ]).then((resposta) => {

        const accountName = resposta['accountName']

        //verifica se a conta existe
        if (!checkAccount(accountName)) {
            return depostit()
        } 

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?'
        }]).then((resposta) => {
            const amount = resposta['amount']

            addAmount(accountName, amount)
            operation()

        }).catch((err) => {
            console.log(err)
        })

    })

}

//HELPER VERIFICAR SE A CONTA EXISTE
function checkAccount(accountName) {

    //verifica se já existe uma conta com este nome
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, confira os dados informados'));
        return false
    }

    return true

}

//HELPER ADICIONAR VALOR
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return depostit()
    }   

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Sucesso! Foi depositado um valor de R$${amount} na sua conta!`))
}

//HELPER LER CONTA
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//CONSULTAR SALDO 
function getAccountBalance() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((resposta) => {

        const accountName = resposta['accountName']

        //verificar se a conta existe
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Olá, o valor da sua conta é de R$${accountData.balance}`))
        operation()

    }).catch(err => console.log(err))
}

//INTERFACE SACAR
function withDraw() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((resposta) => {

        const accountName = resposta['accountName']

        //verifica se a conta existe
        if(!checkAccount(accountName)) {
            return withDraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja sacar?'
        }]).then(resposta => {

            const amount = resposta['amount']

            //SAQUE
            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

//SACAR
function removeAmount(accountName, amount) {

    //pegar a conta
    const accountData = getAccount(accountName)

    //verificar se o valor foi digitado
    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return withDraw
    } 

    //veirificar se possui o valor na conta
    if(accountData.balance < amount){
        console.log(chalk.bgRed.black(`Valor indisponível`))
        return withDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function(err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Sucesso! Você realizou um saque no valor de R$${amount} da sua conta!`))
    operation()
}