const Octokit = require('@octokit/rest');
const githubQ = require('./githubQ');
const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {
  createRepo : async (name) => {
    const credentials = await githubQ.githubQuestions();
    
    var request = require('request'),
      username = credentials.username,
      password = credentials.password,
      url = 'https://api.github.com/user',
      auth = 'Basic '+ new Buffer.from(username + ':' + password).toString('base64');

    
    let login = request(
      {
        url : url,
        headers : {
          'Authorization' : auth,
        },
      },
      function (error, response, body) {
        // Do more stuff with 'body' here
      }
    );
    
    new Octokit({
      auth () {
        return login.headers.Authorization;
      },
    }).request('POST /user/repos',{
      'name': `${name}`,
      'description': 'testing for npm package',
      'homepage': 'https://github.com',
      'private': false,
      'has_issues': true,
      'has_projects': true,
      'has_wiki': true,
    }).then(repo => {
      console.log(repo.data.full_name, '✅');
      console.log('⭐️ ',`/${name}`, ' ⭐️');
      require('simple-git')()
        .init()
        .add(`${name}/`)
        .commit('first commit!')
        .addRemote('origin', `https://github.com/${repo.data.full_name}.git`)
        .push(['-u', 'origin', 'tanner-day3-afterhours'], () => console.log('done'));
    }).catch(err => console.log(err));
      
    // const simpleGit = require('simple-git')(`https://github.com/${repo.full_name}`);
    // simpleGit.init().add(`./${name}`).commit(`first commit`).push(`origin`,`master`);
    

    console.log(' ');
    console.log(chalk.white(figlet.textSync('N E X T  S T E P S : ', { font: 'short' })));
    console.log(chalk.red(`cd ${name}`));
    console.log(chalk.yellow(`npm i`));
    console.log(chalk.blue(`npm start`));
  },

};


// console.log(login.headers.Authorization);
