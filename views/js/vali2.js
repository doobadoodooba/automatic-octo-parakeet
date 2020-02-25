const name = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')

//register

form.addEventListener('submit', (e) =>{

  let messages = []
  //name section_____________________________________________
  if (name.value === '' || name.value == null){
    messages.push('Name is required')
  }

  if (password.value === '' || password.value == null){
    messages.push('Password is required \n')
    name.value = ''
    password.value = ''
  }

  if(name.value <= 4 || name.value >= 20){
    messages.push('Name must be longer than 4 \n')
    name.value = ''
    password.value = ''
    //console.log(name.value)
  }

  if(name.value === 'name'){
    messages.push('Name cannot be name \n')
    name.value = ''
    password.value = ''
  }

  if(name.value === 'Name'){
    messages.push('Name cannot be name \n')
    name.value = ''
    password.value = ''
  }

  if(name.value === 'Admin'){
    messages.push('Name cannot be Admin \n')
    name.value = ''
    password.value = ''
  }

  if(name.value === 'admin'){
    messages.push('Name cannot be admin \n')
    name.value = ''
    password.value = ''
  }

  // password section_______________________________________
  if(password.value >= 20 || password.value <= 6){
    messages.push('Password needs at least 1 letter \n')
    name.value = ''
    password.value = ''
    //console.log(password.value)
  }

  if(password.value === 'password'){
    messages.push('Password cannot be password \n')
    name.value = ''
    password.value = ''
  }

  if(password.value === '123456'){
    messages.push('Password cannot be 123456 \n')
    name.value = ''
    password.value = ''
  }

  if (password.value.search(/[a-z]/) == -1) {
    messages.push('Your password needs at least one lower case letter. \n')
    name.value = ''
    password.value = ''

  }

  if (password.value.search(/[A-Z]/) == -1) {
    messages.push('Your password needs at least one upper case letter. \n')
    name.value = ''
    password.value = ''
  }

  // email section_________________________________________
  if(email.value ===''|| email.value == null){
    messages.push('Email is required \n')
    name.value = ''
    password.value = ''
  }

  if(email.value >=50 || email.value <= 4){
    messages.push('Email must be longer than 4 \n')
    name.value = ''
    password.value = ''
  }
  if(email.value.indexOf("@", 0) < 0 || email.value.indexOf(".", 0) < 0) {
    messages.push('False Email address \n')
    name.value = ''
    password.value = ''
  }


  if (messages.length > 0){
    e.preventDefault()
    errorElement.innerText = messages.join(' ')
  } else {
    setTimeout(function(){
       window.stop(1);
       messages.push('User already exists !')
       name.value = ''
       password.value = ''
       e.preventDefault()
       errorElement.innerText = messages.join(' ')
    }, 5000);


  }



  console.log('Form has been submitted!')
})
