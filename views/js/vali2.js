const name = document.getElementById('username')
const password = document.getElementById('password')
const email = document.getElementById('email')
const form = document.getElementById('form')
const errorElement = document.getElementById('error')

//register

form.addEventListener('submit', (e) =>{

  let messages = []

  if (name.value === '' || name.value == null){
    messages.push('Name is required')
  }

  if (password.value === '' || password.value == null){
    messages.push('Password is required \n')
  }

  if(name.value <= 4 || name.value >= 20){
    messages.push('Name must be longer than 4 \n')
    console.log(name.value)
  }

  if(password.value >= 20 || password.value <= 6){
    messages.push('Password needs at least 1 letter \n')
    console.log(password.value)
  }

  if(password.value === 'password'){
    messages.push('Password cannot be password \n')
  }

  if(password.value === '123456'){
    messages.push('Password cannot be 123456 \n')
  }

  if(email.value ===''|| email.value == null){
    messages.push('Email is required \n')
  }

  if(email.value >=50 || email.value <= 4){
    messages.push('Email must be longer than 4 \n')
  }
  if(email.value.indexOf("@", 0) < 0){
    messages.push('False Email address \n')
  }


  if (messages.length > 0){
    e.preventDefault()
    errorElement.innerText = messages.join(', ')
  } else {
    setTimeout(function(){
       window.stop(1);
       messages.push('User already exists !')
       e.preventDefault()
       errorElement.innerText = messages.join(', ')
    }, 5000);


  }



  console.log('Form has been submitted!')
})
