//modulos externos
import inquirer from 'inquirer';
import chalk from 'chalk';

//modulos internos
import fs from 'fs';

operation()

//Função com as opções
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

        } else if ( action === 'Depositar') {
            depostit()
        } else if ( action === 'Sacar') {

        } else if ( action === 'Sair') {
            console.log((chalk.bgBlue.black('Obrigado por usar o nosso sistema!')))
            process.exit()
        }

    }).catch((err) => {

        console.log(err);

    })
}

//retorno da função buildAccount
function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

    buildAccount();
}

//função para criar uma conta
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

//função para realizar um deposito
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
        } else {
            //lógica para realizar deposito
        }

    })

}

// função para verificar se a conta informada existe
function checkAccount(accountName) {

    //verifica se já existe uma conta com este nome
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, confira os dados informados'));
        return false
    }

    return true

}